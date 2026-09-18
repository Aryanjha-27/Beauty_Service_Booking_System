import { apiClient, backendMissing, normalizeList } from "./apiClient";
async function listNotifications() {
  try {
    const payload = await apiClient.get("/customer/notifications/");
    return normalizeList(payload).results;
  } catch {
    return backendMissing("GET /api/customer/notifications/");
  }
}
async function markNotificationRead(nid) {
  return apiClient.post(`/customer/notifications/${nid}/read/`);
}
async function markAllNotificationsRead() {
  return apiClient.post("/customer/notifications/read-all/");
}
export { listNotifications, markAllNotificationsRead, markNotificationRead };
