export const formatCurrency = (
  amount: number,
  currency = 'USD',
  decimalPlaces?: number,
) => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits:
      typeof decimalPlaces === 'number' ? decimalPlaces : undefined,
  })
}
