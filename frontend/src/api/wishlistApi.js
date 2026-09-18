import { apiClient, backendMissing, normalizeList } from "./apiClient";
async function listWishlist() {
  try {
    const payload = await apiClient.get("/customer/wishlist/");
    return normalizeList(payload).results;
  } catch (error) {
    if (error?.status === 404 || error?.status === 0) {
      return backendMissing("GET /api/customer/wishlist/");
    }
    throw error;
  }
}
async function addToWishlist(serviceId) {
  try {
    return await apiClient.post("/customer/wishlist/", { service_id: serviceId });
  } catch (error) {
    if (error?.status === 404 || error?.status === 0) {
      return backendMissing("POST /api/customer/wishlist/");
    }
    throw error;
  }
}
async function removeFromWishlist(id) {
  try {
    await apiClient.delete(`/customer/wishlist/${id}/`);
  } catch (error) {
    if (error?.status === 404 || error?.status === 0) {
      return backendMissing(`DELETE /api/customer/wishlist/${id}/`);
    }
    throw error;
  }
}
export { addToWishlist, listWishlist, removeFromWishlist };
