import pool from './pool';
import { Project, Transaction, Flock } from '@types/index';
import { v4 as uuidv4 } from 'uuid';

// ============ Project Queries ============

export async function getProjectById(projectId: string): Promise<Project | null> {
  const result = await pool.query(
    `SELECT id, name, description, start_date, initial_capital, initial_flock_size, currency, created_at, updated_at
     FROM projects WHERE id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

export async function createProject(
  name: string,
  description: string,
  initialCapital: number,
  initialFlockSize: number = 10,
  currency: string = 'DZD'
): Promise<Project> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO projects (id, name, description, initial_capital, initial_flock_size, currency)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, description, start_date, initial_capital, initial_flock_size, currency, created_at, updated_at`,
    [id, name, description, initialCapital, initialFlockSize, currency]
  );

  // Create flock record
  await pool.query(
    `INSERT INTO flocks (project_id, current_count) VALUES ($1, $2)`,
    [id, initialFlockSize]
  );

  return result.rows[0];
}

// ============ Flock Queries ============

export async function getFlockByProjectId(projectId: string): Promise<Flock | null> {
  const result = await pool.query(
    `SELECT id, project_id, current_count, total_births, total_purchases, total_sales, total_deaths, updated_at
     FROM flocks WHERE project_id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

export async function updateFlockCount(
  projectId: string,
  currentCount: number
): Promise<Flock> {
  const result = await pool.query(
    `UPDATE flocks SET current_count = $1, updated_at = CURRENT_TIMESTAMP
     WHERE project_id = $2
     RETURNING id, project_id, current_count, total_births, total_purchases, total_sales, total_deaths, updated_at`,
    [currentCount, projectId]
  );
  return result.rows[0];
}

export async function updateFlockStats(
  projectId: string,
  stats: {
    totalBirths?: number;
    totalPurchases?: number;
    totalSales?: number;
    totalDeaths?: number;
  }
): Promise<Flock> {
  const updates = [];
  const values = [projectId];
  let paramIndex = 2;

  if (stats.totalBirths !== undefined) {
    updates.push(`total_births = $${paramIndex}`);
    values.push(stats.totalBirths);
    paramIndex++;
  }
  if (stats.totalPurchases !== undefined) {
    updates.push(`total_purchases = $${paramIndex}`);
    values.push(stats.totalPurchases);
    paramIndex++;
  }
  if (stats.totalSales !== undefined) {
    updates.push(`total_sales = $${paramIndex}`);
    values.push(stats.totalSales);
    paramIndex++;
  }
  if (stats.totalDeaths !== undefined) {
    updates.push(`total_deaths = $${paramIndex}`);
    values.push(stats.totalDeaths);
    paramIndex++;
  }

  const query = `
    UPDATE flocks 
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE project_id = $1
    RETURNING id, project_id, current_count, total_births, total_purchases, total_sales, total_deaths, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

// ============ Transaction Queries ============

export async function getTransactionsByProjectId(
  projectId: string,
  limit: number = 100,
  offset: number = 0
): Promise<Transaction[]> {
  const result = await pool.query(
    `SELECT id, project_id, type, amount, quantity, description, category, transaction_date, notes, created_at, updated_at
     FROM transactions
     WHERE project_id = $1
     ORDER BY transaction_date DESC, created_at DESC
     LIMIT $2 OFFSET $3`,
    [projectId, limit, offset]
  );
  return result.rows;
}

export async function createTransaction(
  projectId: string,
  type: string,
  amount: number,
  quantity: number | null,
  description: string,
  category: string | null,
  transactionDate: Date,
  notes: string | null = null
): Promise<Transaction> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO transactions (id, project_id, type, amount, quantity, description, category, transaction_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, project_id, type, amount, quantity, description, category, transaction_date, notes, created_at, updated_at`,
    [id, projectId, type, amount, quantity, description, category, transactionDate, notes]
  );
  return result.rows[0];
}

export async function updateTransaction(
  transactionId: string,
  updates: {
    amount?: number;
    quantity?: number;
    description?: string;
    category?: string;
    transactionDate?: Date;
    notes?: string;
  }
): Promise<Transaction> {
  const fields = [];
  const values = [transactionId];
  let paramIndex = 2;

  if (updates.amount !== undefined) {
    fields.push(`amount = $${paramIndex}`);
    values.push(updates.amount);
    paramIndex++;
  }
  if (updates.quantity !== undefined) {
    fields.push(`quantity = $${paramIndex}`);
    values.push(updates.quantity);
    paramIndex++;
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${paramIndex}`);
    values.push(updates.description);
    paramIndex++;
  }
  if (updates.category !== undefined) {
    fields.push(`category = $${paramIndex}`);
    values.push(updates.category);
    paramIndex++;
  }
  if (updates.transactionDate !== undefined) {
    fields.push(`transaction_date = $${paramIndex}`);
    values.push(updates.transactionDate);
    paramIndex++;
  }
  if (updates.notes !== undefined) {
    fields.push(`notes = $${paramIndex}`);
    values.push(updates.notes);
    paramIndex++;
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const query = `
    UPDATE transactions
    SET ${fields.join(', ')}
    WHERE id = $1
    RETURNING id, project_id, type, amount, quantity, description, category, transaction_date, notes, created_at, updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  await pool.query('DELETE FROM transactions WHERE id = $1', [transactionId]);
}

// ============ Purchase Queries ============

export async function createPurchaseDetails(
  transactionId: string,
  seller: string | null,
  transportCost: number = 0,
  marketFees: number = 0,
  additionalCosts: number = 0,
  paymentMethod: string | null,
  amountPaid: number | null,
  amountRemaining: number | null
) {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO purchases (id, transaction_id, seller, transport_cost, market_fees, additional_costs, payment_method, amount_paid, amount_remaining)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, transactionId, seller, transportCost, marketFees, additionalCosts, paymentMethod, amountPaid, amountRemaining]
  );
}

// ============ Birth Queries ============

export async function createBirthDetails(
  transactionId: string,
  maleCount: number,
  femaleCount: number
) {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO births (id, transaction_id, male_count, female_count)
     VALUES ($1, $2, $3, $4)`,
    [id, transactionId, maleCount, femaleCount]
  );
}

// ============ Sale Queries ============

export async function createSaleDetails(
  transactionId: string,
  buyer: string | null,
  saleCosts: number = 0,
  transportCost: number = 0,
  marketFees: number = 0,
  amountReceived: number | null,
  amountRemaining: number | null
) {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO sales (id, transaction_id, buyer, sale_costs, transport_cost, market_fees, amount_received, amount_remaining)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, transactionId, buyer, saleCosts, transportCost, marketFees, amountReceived, amountRemaining]
  );
}

// ============ Death Queries ============

export async function createDeathDetails(transactionId: string, cause: string | null) {
  const id = uuidv4();
  return pool.query(
    `INSERT INTO deaths (id, transaction_id, cause)
     VALUES ($1, $2, $3)`,
    [id, transactionId, cause]
  );
}

// ============ Feed Queries ============

export async function getFeedTypesByProjectId(projectId: string): Promise<any[]> {
  const result = await pool.query(
    `SELECT id, project_id, name, unit, current_stock, unit_price, total_cost, last_purchase_date, created_at, updated_at
     FROM feed_types
     WHERE project_id = $1`,
    [projectId]
  );
  return result.rows;
}

export async function createFeedType(
  projectId: string,
  name: string,
  unit: string,
  unitPrice: number = 0
): Promise<any> {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO feed_types (id, project_id, name, unit, current_stock, unit_price)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, project_id, name, unit, current_stock, unit_price, total_cost, last_purchase_date, created_at, updated_at`,
    [id, projectId, name, unit, 0, unitPrice]
  );
  return result.rows[0];
}

export async function createFeedTransaction(
  feedTypeId: string,
  projectId: string,
  type: 'purchase' | 'usage',
  quantity: number,
  unitPrice: number | null,
  totalCost: number | null,
  transactionDate: Date,
  notes: string | null = null
): Promise<any> {
  const id = uuidv4();

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create feed transaction record
    const result = await client.query(
      `INSERT INTO feed_transactions (id, feed_type_id, project_id, type, quantity, unit_price, total_cost, transaction_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, feed_type_id, project_id, type, quantity, unit_price, total_cost, transaction_date, notes, created_at`,
      [id, feedTypeId, projectId, type, quantity, unitPrice, totalCost, transactionDate, notes]
    );

    // Update feed stock
    if (type === 'purchase') {
      await client.query(
        `UPDATE feed_types
         SET current_stock = current_stock + $1, 
             total_cost = total_cost + COALESCE($2, 0),
             last_purchase_date = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [quantity, totalCost, transactionDate, feedTypeId]
      );
    } else if (type === 'usage') {
      await client.query(
        `UPDATE feed_types
         SET current_stock = GREATEST(0, current_stock - $1),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [quantity, feedTypeId]
      );
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
