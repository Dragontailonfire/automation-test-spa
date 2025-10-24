import { VercelRequest, VercelResponse } from '@vercel/node';
import handler from './[type]';

export const config = {
  runtime: 'nodejs18.x'
};

export default async function (req: VercelRequest, res: VercelResponse) {
  // Set query type before forwarding
  if (!req.query) req.query = {};
  req.query.type = 'horizontal';
  return handler(req, res);
}
