import { apiClient, backendMissing, normalizeList } from "./apiClient";
async function listServiceReviews(sid) {
  try {
    const payload = await apiClient.get(`/services/${encodeURIComponent(sid)}/reviews/`, {
      auth: false,
    });
    if (payload && typeof payload === "object" && Array.isArray(payload)) {
      return { average_rating: null, review_count: payload.length, results: payload };
    }
    const list = normalizeList(payload);
    return { average_rating: null, review_count: list.count, results: list.results };
  } catch {
    return backendMissing(`GET /api/services/${sid}/reviews/`);
  }
}
async function createReview(payload) {
  return apiClient.post(`/services/${encodeURIComponent(payload.service)}/reviews/`, {
    booking: payload.booking,
    rating: payload.rating,
    review: payload.review,
  });
}
async function listMyReviews() {
  const payload = await apiClient.get("/reviews/");
  return normalizeList(payload).results;
}
export { createReview, listMyReviews, listServiceReviews };
