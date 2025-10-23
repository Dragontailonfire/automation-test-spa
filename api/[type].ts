import { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Config {
  tabs: {
    showVertical: boolean;
    showHorizontal: boolean;
  };
  lists: {
    vertical: {
      total: number;
      visibleRange: number;
      prefix: string;
    };
    horizontal: {
      total: number;
      visibleRange: number;
      prefix: string;
    };
  };
}

const defaultConfig: Config = {
  tabs: {
    showVertical: true,
    showHorizontal: true
  },
  lists: {
    vertical: {
      total: 10000,
      visibleRange: 50,
      prefix: 'Vertical'
    },
    horizontal: {
      total: 100,
      visibleRange: 20,
      prefix: 'Horizontal'
    }
  }
};

let config: Config;
try {
  config = JSON.parse(readFileSync(join(process.cwd(), 'api', 'data', 'config.json'), 'utf8'));
} catch (e) {
  config = defaultConfig;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Allow config to be fetched with /api/config
  if (req.query.type === 'config') {
    return res.json(config);
  }

  const listType = req.query.type as 'vertical' | 'horizontal';
  if (!['vertical', 'horizontal'].includes(listType)) {
    return res.status(400).json({ error: 'Invalid list type' });
  }

  const start = Number(req.query.start) || 0;
  const visibleRange = Number(req.query.visibleRange) || config.lists[listType].visibleRange;
  const end = start + visibleRange;

  const listConfig = config.lists[listType];
  if (!listConfig) {
    return res.status(404).json({ error: 'List type not found' });
  }

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

  res.json({
    items,
    start: s,
    end: e,
    total: listConfig.total,
    visibleRange
  });
}