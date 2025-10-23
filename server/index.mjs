import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = process.env.PORT || 4001;
const CONFIG_PATH = path.resolve(process.cwd(), 'server', 'config.json');

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/config') {
      const data = await fs.readFile(CONFIG_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
      return;
    }

    const urlObj = new URL(req.url || '/', `http://localhost:${PORT}`);
    if (urlObj.pathname.match(/^\/api\/(vertical|horizontal)$/)) {
      const listType = urlObj.pathname.split('/').pop();
      const start = Number(urlObj.searchParams.get('start') || '0');
      const visibleRange = Number(urlObj.searchParams.get('visibleRange'));

      // read config
      const cfgRaw = await fs.readFile(CONFIG_PATH, 'utf8');
      const cfg = JSON.parse(cfgRaw);
      const listConfig = cfg.lists[listType];

      if (!listConfig) {
        res.writeHead(404);
        res.end('List type not found');
        return;
      }

      // Use config's visible range if not provided in query
      const range = visibleRange || listConfig.visibleRange;
      const end = start + range;

      // clamp indices
      const s = Math.max(0, start);
      const e = Math.max(s, Math.min(listConfig.total, end));

      // generate items on demand
      const items = [];
      for (let i = s; i < e; i++) {
        items.push({ 
          id: `${listConfig.prefix}-${i}`, 
          text: `${listConfig.prefix} Item ${i}`, 
          value: Math.floor(Math.random() * 1000) 
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        items,
        start: s,
        end: e,
        total: listConfig.total,
        visibleRange: range
      }));
      return;
    }

    // simple static file fallback for dev convenience
    const file = path.join(process.cwd(), 'public', req.url || '/');
    try {
      const stat = await fs.stat(file);
      if (stat.isFile()) {
        const body = await fs.readFile(file);
        res.writeHead(200);
        res.end(body);
        return;
      }
    } catch {}

    res.writeHead(404);
    res.end('Not found');
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

server.listen(PORT, () => {
  console.log(`Local API server listening on http://localhost:${PORT}`);
});
