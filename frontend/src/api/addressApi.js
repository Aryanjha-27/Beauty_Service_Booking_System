import { apiClient, backendMissing, normalizeList } from "./apiClient";
async function listAddresses() {
  try {
    const payload = await apiClient.get("/customer/address/");
    return normalizeList(payload).results;
  } catch {
    return backendMissing("GET /api/customer/address/");
  }
}
async function createAddress(data) {
  try {
    return await apiClient.post("/customer/address/", data);
  } catch (error) {
    if (error?.status !== 404 && error?.status !== 0) throw error;
    return backendMissing("POST /api/customer/address/");
  }
}
async function updateAddress(id, data) {
  try {
    return await apiClient.patch(`/customer/address/${id}/`, data);
  } catch (error) {
    if (error?.status !== 404 && error?.status !== 0) throw error;
    return backendMissing(`PATCH /api/customer/address/${id}/`);
  }
}
async function deleteAddress(id) {
  try {
    await apiClient.delete(`/customer/address/${id}/`);
  } catch (error) {
    if (error?.status !== 404 && error?.status !== 0) throw error;
    return backendMissing(`DELETE /api/customer/address/${id}/`);
  }
}
export { createAddress, deleteAddress, listAddresses, updateAddress };
