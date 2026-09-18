import { useState, useEffect, useCallback } from "react";
import { listBookings } from "@/api/bookingApi";

/**
 * Custom Hook for Fetching User Bookings - Standard React state/effect
 * Clean, beginner-friendly for 4th Sem BCA project
 */
export function useBookings(status = "All") {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = status && status !== "All" ? { status } : {};
      const res = await listBookings(params);
      setData(res);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { data, isLoading, isError, error, refetch: fetchBookings };
}
