import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { quantity, date, cause, notes } = req.body;

      // Create transaction
      const transaction = await queries.createTransaction(
        PROJECT_ID,
        'death',
        0,
        quantity,
        `نفوق ${quantity} أغنام`,
        'death',
        new Date(date),
        notes
      );

      // Create death details
      await queries.createDeathDetails(transaction.id, cause);

      // Update flock count
      const flock = await queries.getFlockByProjectId(PROJECT_ID);
      if (flock) {
        const newCount = Math.max(0, flock.current_count - quantity);
        await queries.updateFlockCount(PROJECT_ID, newCount);
        await queries.updateFlockStats(PROJECT_ID, {
          totalDeaths: flock.total_deaths + quantity,
        });
      }

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Create death error:', error);
      res.status(500).json({ error: 'Failed to record death' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
