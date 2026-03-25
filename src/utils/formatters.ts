export const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  if (absAmount >= 100000) {
    return `\u20B9${(absAmount / 1000)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}k`;
  }
  if (absAmount >= 1000) {
    const formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `\u20B9${formatted}`;
  }
  return `\u20B9${absAmount}`;
};

export const formatCurrencyFull = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `\u20B9${formatted}`;
};

export const formatAmount = (amount: number): string => {
  const prefix = amount >= 0 ? '+' : '-';
  const absAmount = Math.abs(amount);
  if (absAmount >= 1000) {
    const formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${prefix}\u20B9${formatted}`;
  }
  return `${prefix}\u20B9${absAmount}`;
};
