
import { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs'
};

const lists = {
  vertical: {
    total: process.env.VERTICAL_LIST_TOTAL ? parseInt(process.env.VERTICAL_LIST_TOTAL) : 10000,
    visibleRange: process.env.VERTICAL_LIST_RANGE ? parseInt(process.env.VERTICAL_LIST_RANGE) : 50
  },
  horizontal: {
    total: process.env.HORIZONTAL_LIST_TOTAL ? parseInt(process.env.HORIZONTAL_LIST_TOTAL) : 100,
    visibleRange: process.env.HORIZONTAL_LIST_RANGE ? parseInt(process.env.HORIZONTAL_LIST_RANGE) : 20
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const listType = req.query.type as string;

    // Validate list type
    if (!['vertical', 'horizontal'].includes(listType)) {
      return res.status(400).json({ error: 'Invalid list type' });
    }

    const listConfig = lists[listType as keyof typeof lists];
    const start = Number(req.query.start) || 0;
    const visibleRange = Number(req.query.visibleRange) || listConfig.visibleRange;

    // Clamp indices
    const s = Math.max(0, start);
    const e = Math.max(s, Math.min(listConfig.total, start + visibleRange));

    // Generate items
    const items = Array.from({ length: e - s }, (_, i) => ({
      id: `${listType}-${s + i}`,
      text: `${listType.charAt(0).toUpperCase() + listType.slice(1)} Item ${s + i}`,
      value: Math.floor(Math.random() * 1000)
    }));

    return res.json({
      items,
      start: s,
      end: e,
      total: listConfig.total,
      visibleRange
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
