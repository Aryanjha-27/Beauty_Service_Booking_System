import { API_SERVER_URL } from "@/api/apiClient";
function imageUrl(path) {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/")) return `${API_SERVER_URL}${trimmed}`;
  return `${API_SERVER_URL}/${trimmed}`;
}
export { imageUrl };
