import { VercelRequest, VercelResponse } from '@vercel/node';
import handler from './[type]';

export const config = {
  runtime: 'nodejs'
};

export default async function (req: VercelRequest, res: VercelResponse) {
  // Set query type before forwarding
  if (!req.query) req.query = {};
  req.query.type = 'vertical';
  return handler(req, res);
}
