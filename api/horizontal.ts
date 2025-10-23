import handler from './[type]';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  // forward to dynamic handler with type=horizontal
  req.query = { ...(req.query || {}), type: 'horizontal' } as any;
  return handler(req, res);
}
