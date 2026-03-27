const RUPEE = '\u20B9';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  if (absAmount >= 100000) {
    return `${RUPEE}${(absAmount / 1000)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}k`;
  }
  if (absAmount >= 1000) {
    const formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${RUPEE}${formatted}`;
  }
  return `${RUPEE}${absAmount}`;
};

export const formatCurrencyFull = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${RUPEE}${formatted}`;
};

export const formatAmount = (amount: number): string => {
  const prefix = amount >= 0 ? '+' : '-';
  const absAmount = Math.abs(amount);
  if (absAmount >= 1000) {
    const formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${prefix}${RUPEE}${formatted}`;
  }
  return `${prefix}${RUPEE}${absAmount}`;
};

export const formatShort = (n: number): string => {
  if (n >= 1000) {
    return `${RUPEE}${(n / 1000).toFixed(0)}k`;
  }
  return `${RUPEE}${n}`;
};

export const getTodayLabel = (): string => {
  const now = new Date();
  const day = now.getDate();
  const month = MONTH_NAMES[now.getMonth()];
  return `Today, ${day} ${month}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
};
