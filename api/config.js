const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // try to read from server/config.json first (useful in monorepo/dev deployment)
  const serverConfigPath = path.join(process.cwd(), 'server', 'config.json');
  const publicConfigPath = path.join(process.cwd(), 'public', 'data.json');

  let data = null;
  try {
    if (fs.existsSync(serverConfigPath)) {
      data = fs.readFileSync(serverConfigPath, 'utf8');
    } else if (fs.existsSync(publicConfigPath)) {
      data = fs.readFileSync(publicConfigPath, 'utf8');
    }
  } catch (e) {
    console.error('Failed to read config', e);
  }

  if (!data) {
    res.status(500).send({ error: 'Config not found' });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(data);
};
