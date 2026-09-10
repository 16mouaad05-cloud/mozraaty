// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  initialCapital: number;
  initialFlockSize: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Flock Types
export interface Flock {
  id: string;
  projectId: string;
  currentCount: number;
  totalBirths: number;
  totalPurchases: number;
  totalSales: number;
  totalDeaths: number;
  updatedAt: Date;
}

// Transaction Types
export type TransactionType = 'purchase' | 'birth' | 'sale' | 'death' | 'expense' | 'income';

export interface Transaction {
  id: string;
  projectId: string;
  type: TransactionType;
  amount: number;
  quantity?: number;
  description: string;
  date: Date;
  category?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Purchase Types
export interface Purchase extends Transaction {
  type: 'purchase';
  seller?: string;
  transportCost?: number;
  marketFees?: number;
  additionalCosts?: number;
  paymentMethod?: string;
  amountPaid?: number;
  amountRemaining?: number;
}

// Birth Types
export interface Birth extends Transaction {
  type: 'birth';
  maleCount: number;
  femaleCount: number;
}

// Sale Types
export interface Sale extends Transaction {
  type: 'sale';
  buyer?: string;
  saleCosts?: number;
  transportCost?: number;
  marketFees?: number;
  amountReceived?: number;
  amountRemaining?: number;
}

// Death Types
export interface Death extends Transaction {
  type: 'death';
  cause?: string;
}

// Expense Types
export type ExpenseCategory =
  | 'feed'
  | 'hay'
  | 'barley'
  | 'medicine'
  | 'vaccine'
  | 'veterinary'
  | 'transport'
  | 'water'
  | 'electricity'
  | 'barn'
  | 'maintenance'
  | 'equipment'
  | 'market_fees'
  | 'other';

export interface Expense extends Transaction {
  type: 'expense';
  category: ExpenseCategory;
}

// Feed Types
export interface FeedType {
  id: string;
  projectId: string;
  name: string; // 'barley', 'hay', 'clover', etc.
  unit: string; // 'kg', 'ton', 'bag'
  currentStock: number;
  unitPrice: number;
  totalCost: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedTransaction {
  id: string;
  feedTypeId: string;
  projectId: string;
  type: 'purchase' | 'usage';
  quantity: number;
  unitPrice?: number;
  totalCost?: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

// Financial Summary
export interface FinancialSummary {
  initialCapital: number;
  totalIncome: number; // من المبيعات
  totalExpenses: number;
  totalPurchases: number; // تكلفة شراء الأغنام
  totalSales: number; // عائد بيع الأغنام
  currentBalance: number;
  estimatedFlockValue: number;
  netResult: number;
  profitMargin: number;
}

// Flock Summary
export interface FlockSummary {
  currentCount: number;
  totalBirths: number;
  totalPurchases: number;
  totalSales: number;
  totalDeaths: number;
  growthPercentage: number;
  averageAgeMonths?: number;
}

// Dashboard Data
export interface DashboardData {
  project: Project;
  flock: FlockSummary;
  financial: FinancialSummary;
  recentTransactions: Transaction[];
  monthlyTrend: {
    month: string;
    expenses: number;
    income: number;
    flockChange: number;
  }[];
}
