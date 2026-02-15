export const calculatePaystackTotal = (amount: number) => {
  let flatFee = 0;
  const percent = 0.015; // 1.5%
  const cap = 2000; // 2000 NGN

  // If amount is large enough to trigger the 100 naira fee
  if (amount >= 2500) {
    flatFee = 100;
  }

  // Formula: (Amount + Flat) / (1 - Percent)
  let total = (amount + flatFee) / (1 - percent);

  // Check fee cap
  let fee = total - amount;
  if (fee > cap) {
    fee = cap;
  }

  // Recalculate total with final fee (ceil to match backend)
  const finalTotal = Math.ceil(amount + fee);
  const finalFee = Math.ceil(fee);

  return {
    fee: finalFee,
    total: finalTotal,
  };
};
