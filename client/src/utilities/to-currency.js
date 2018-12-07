export function toCurrency(total) {
  return total.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}
