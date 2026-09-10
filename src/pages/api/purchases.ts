import type { NextApiRequest, NextApiResponse } = require('next');
import * as queries from '@/db/queries';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'default-project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { quantity, amount, date, seller, transportCost, marketFees, additionalCosts, paymentMethod, amountPaid, notes } = req.body;

      // Create transaction
      const transaction = await queries.createTransaction(
        PROJECT_ID,
        'purchase',
        amount,
        quantity,
        `شراء ${quantity} أغنام`,
        'purchase',
        new Date(date),
        notes
      );

      // Create purchase details
      await queries.createPurchaseDetails(
        transaction.id,
        seller,
        transportCost,
        marketFees,
        additionalCosts,
        paymentMethod,
        amountPaid,
        amountPaid ? amount - amountPaid : amount
      );

      // Update flock count
      const flock = await queries.getFlockByProjectId(PROJECT_ID);
      if (flock) {
        const newCount = flock.current_count + quantity;
        await queries.updateFlockCount(PROJECT_ID, newCount);
        await queries.updateFlockStats(PROJECT_ID, {
          totalPurchases: flock.total_purchases + quantity,
        });
      }

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Create purchase error:', error);
      res.status(500).json({ error: 'Failed to create purchase' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
