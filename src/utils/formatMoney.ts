const moneyFormatter = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const parseAmountInput = (value: string | number): number => {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round(value * 100) / 100;
  }

  const normalized = value.replace(',', '.').trim();
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.round(parsed * 100) / 100;
};

export const formatMoney = (value: number | string): string => {
  return moneyFormatter.format(parseAmountInput(value));
};
