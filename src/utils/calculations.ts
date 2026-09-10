import { Transaction, Flock, FinancialSummary, FlockSummary } from '@types/index';

/**
 * حساب عدد القطيع الحالي
 * المعادلة:
 * العدد الحالي = العدد الأولي + المشتريات + الولادات - المبيعات - النفوق
 */
export const calculateCurrentFlockCount = (
  initialCount: number,
  transactions: Transaction[]
): number => {
  let count = initialCount;

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case 'purchase':
      case 'birth':
        count += transaction.quantity || 0;
        break;
      case 'sale':
      case 'death':
        count -= transaction.quantity || 0;
        break;
    }
  });

  return Math.max(0, count);
};

/**
 * حساب ملخص القطيع
 */
export const calculateFlockSummary = (
  initialCount: number,
  transactions: Transaction[]
): FlockSummary => {
  const flockTransactions = transactions.filter(
    (t) => t.type === 'purchase' || t.type === 'birth' || t.type === 'sale' || t.type === 'death'
  );

  const totalPurchases = flockTransactions
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + (t.quantity || 0), 0);

  const totalBirths = flockTransactions
    .filter((t) => t.type === 'birth')
    .reduce((sum, t) => sum + (t.quantity || 0), 0);

  const totalSales = flockTransactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + (t.quantity || 0), 0);

  const totalDeaths = flockTransactions
    .filter((t) => t.type === 'death')
    .reduce((sum, t) => sum + (t.quantity || 0), 0);

  const currentCount = calculateCurrentFlockCount(initialCount, transactions);
  const growthPercentage =
    initialCount > 0 ? ((currentCount - initialCount) / initialCount) * 100 : 0;

  return {
    currentCount,
    totalPurchases,
    totalBirths,
    totalSales,
    totalDeaths,
    growthPercentage,
  };
};

/**
 * حساب الملخص المالي
 */
export const calculateFinancialSummary = (
  initialCapital: number,
  transactions: Transaction[],
  estimatedPricePerSheep: number = 50000
): FinancialSummary => {
  let totalIncome = 0;
  let totalExpenses = 0;
  let totalPurchases = 0;
  let totalSales = 0;

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case 'purchase':
        totalPurchases += transaction.amount || 0;
        totalExpenses += transaction.amount || 0;
        break;
      case 'sale':
        totalSales += transaction.amount || 0;
        totalIncome += transaction.amount || 0;
        break;
      case 'expense':
        totalExpenses += transaction.amount || 0;
        break;
      case 'income':
        totalIncome += transaction.amount || 0;
        break;
    }
  });

  const currentBalance = initialCapital + totalIncome - totalExpenses;
  const flockSummary = calculateFlockSummary(10, transactions);
  const estimatedFlockValue = flockSummary.currentCount * estimatedPricePerSheep;
  const netResult = currentBalance + estimatedFlockValue - initialCapital;
  const profitMargin = initialCapital > 0 ? (netResult / initialCapital) * 100 : 0;

  return {
    initialCapital,
    totalIncome,
    totalExpenses,
    totalPurchases,
    totalSales,
    currentBalance,
    estimatedFlockValue,
    netResult,
    profitMargin,
  };
};

/**
 * إنشاء رسالة ترحيبية ديناميكية
 */
export const getWelcomeMessage = (flockCount: number, profitMargin: number): string => {
  const messages = [
    'قطيعك ينمو خطوة بخطوة 🐑',
    'من 10 رؤوس اليوم... إلى مشروع أكبر غدًا.',
    'راقب نمو قطيعك، وسيطر على أموالك.',
    'كل يوم تخطو خطوة جديدة.',
    'قطيع أكبر، مشروع أقوى.',
    'ابدأ بالقليل وابنِ شيئًا كبيرًا.',
    'تابع أرقامك، وشاهد مشروعك ينمو.',
    'مشروعك يتحرك في الاتجاه الصحيح 📈',
  ];

  if (flockCount >= 50) {
    return 'رائع! قطيعك أصبح ' + flockCount + ' رأسًا 🐑';
  }

  if (profitMargin > 10) {
    return 'مبروك! مشروعك يحقق أرباحًا 💰';
  }

  return messages[Math.floor(Math.random() * messages.length)];
};
