function formatPrice(value) {
  if (value === null || value === void 0 || value === "") return "\u2014";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return String(value);
  return `Rs. ${num.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
function discountPercent(price, effective) {
  const p = Number(price);
  const e = Number(effective);
  if (!p || Number.isNaN(p) || Number.isNaN(e) || e >= p) return null;
  return Math.round(((p - e) / p) * 100);
}
export { discountPercent, formatPrice };
