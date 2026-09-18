import { apiClient, backendMissing } from "./apiClient";
async function initiateKhaltiPayment(bookingId, amount) {
  try {
    return await apiClient.post("/payments/khalti/initiate/", {
      booking_id: bookingId,
      amount,
    });
  } catch (error) {
    if (error?.status !== 404 && error?.status !== 0) throw error;
    return backendMissing("POST /api/payments/khalti/initiate/");
  }
}
export { initiateKhaltiPayment };
