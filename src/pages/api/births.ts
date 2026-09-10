import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { quantity, maleCount, femaleCount, date, notes } = req.body;

      // Create transaction
      const transaction = await queries.createTransaction(
        PROJECT_ID,
        'birth',
        0,
        quantity,
        `ولادة ${quantity} حمل`,
        'birth',
        new Date(date),
        notes
      );

      // Create birth details
      await queries.createBirthDetails(transaction.id, maleCount, femaleCount);

      // Update flock count
      const flock = await queries.getFlockByProjectId(PROJECT_ID);
      if (flock) {
        const newCount = flock.current_count + quantity;
        await queries.updateFlockCount(PROJECT_ID, newCount);
        await queries.updateFlockStats(PROJECT_ID, {
          totalBirths: flock.total_births + quantity,
        });
      }

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Create birth error:', error);
      res.status(500).json({ error: 'Failed to create birth' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
