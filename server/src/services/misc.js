export const generateOtp = () => {
  return Math.floor(Math.random() * 900000) + 100000
}

export const calculateDiscount = (item, price) => {
  if (item?.discountType === 'percentage') {
    const calculated = price * (item.discountValue / 100);
    return item.maxDiscount ? Math.min(calculated, item.maxDiscount) : calculated;
  }
  return item?.discountValue || 0;
}