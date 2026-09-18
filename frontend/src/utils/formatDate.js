function formatDate(value) {
  if (!value) return "\u2014";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(value) {
  if (!value) return "\u2014";
  const [h, m] = value.split(":");
  if (h === void 0 || m === void 0) return value;
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${suffix}`;
}
function todayISO() {
  return /* @__PURE__ */ new Date().toISOString().slice(0, 10);
}
function weekdayName(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
export { formatDate, formatTime, todayISO, weekdayName };
