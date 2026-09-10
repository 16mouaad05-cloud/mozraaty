-- Create Project table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  initial_capital DECIMAL(15, 2) NOT NULL DEFAULT 0,
  initial_flock_size INTEGER NOT NULL DEFAULT 10,
  currency VARCHAR(3) DEFAULT 'DZD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Flock table
CREATE TABLE IF NOT EXISTS flocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  current_count INTEGER NOT NULL DEFAULT 10,
  total_births INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_deaths INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id)
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  quantity INTEGER,
  description TEXT,
  category VARCHAR(100),
  transaction_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Purchase Details table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  seller VARCHAR(255),
  transport_cost DECIMAL(15, 2) DEFAULT 0,
  market_fees DECIMAL(15, 2) DEFAULT 0,
  additional_costs DECIMAL(15, 2) DEFAULT 0,
  payment_method VARCHAR(100),
  amount_paid DECIMAL(15, 2),
  amount_remaining DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Birth Details table
CREATE TABLE IF NOT EXISTS births (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  male_count INTEGER DEFAULT 0,
  female_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Sale Details table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  buyer VARCHAR(255),
  sale_costs DECIMAL(15, 2) DEFAULT 0,
  transport_cost DECIMAL(15, 2) DEFAULT 0,
  market_fees DECIMAL(15, 2) DEFAULT 0,
  amount_received DECIMAL(15, 2),
  amount_remaining DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Death Details table
CREATE TABLE IF NOT EXISTS deaths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  cause VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Feed Types table
CREATE TABLE IF NOT EXISTS feed_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  current_stock DECIMAL(15, 2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(15, 2),
  total_cost DECIMAL(15, 2) DEFAULT 0,
  last_purchase_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Feed Transactions table
CREATE TABLE IF NOT EXISTS feed_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL,
  unit_price DECIMAL(15, 2),
  total_cost DECIMAL(15, 2),
  transaction_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_transactions_project ON transactions(project_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_flocks_project ON flocks(project_id);
CREATE INDEX idx_feed_types_project ON feed_types(project_id);
CREATE INDEX idx_feed_transactions_project ON feed_transactions(project_id);
