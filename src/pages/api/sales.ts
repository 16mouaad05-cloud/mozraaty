import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { quantity, amount, date, buyer, saleCosts, transportCost, marketFees, amountReceived, notes } = req.body;

      // Create transaction
      const transaction = await queries.createTransaction(
        PROJECT_ID,
        'sale',
        amount,
        quantity,
        `بيع ${quantity} أغنام`,
        'sale',
        new Date(date),
        notes
      );

      // Create sale details
      await queries.createSaleDetails(
        transaction.id,
        buyer,
        saleCosts,
        transportCost,
        marketFees,
        amountReceived,
        amountReceived ? amount - amountReceived : amount
      );

      // Update flock count
      const flock = await queries.getFlockByProjectId(PROJECT_ID);
      if (flock) {
        const newCount = Math.max(0, flock.current_count - quantity);
        await queries.updateFlockCount(PROJECT_ID, newCount);
        await queries.updateFlockStats(PROJECT_ID, {
          totalSales: flock.total_sales + quantity,
        });
      }

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Create sale error:', error);
      res.status(500).json({ error: 'Failed to create sale' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
