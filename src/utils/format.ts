export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function calculateShipping(subtotal: number, standardRate: number, freeThreshold: number): number {
  if (subtotal >= freeThreshold) {
    return 0;
  }
  return standardRate;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ISP-${year}-${random}`;
}
