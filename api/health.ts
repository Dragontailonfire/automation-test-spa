import { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs18.x'
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({ 
    status: 'ok',
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  });
}
