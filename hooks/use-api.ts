"use client";

import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function useApi<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<T | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const call = async (
    url: string,
    method: HttpMethod = "GET",
    body: unknown = null
  ): Promise<T> => {
    // Cancel previous in-flight request if any
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await axios<T>({
        url,
        method,
        data: body ?? undefined,
        signal: controller.signal,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      // Don't handle aborted requests as errors
      if (axios.isCancel(err)) {
        return undefined as unknown as T;
      }

      const axiosErr = err as { response?: { status: number; data: unknown }; message?: string };

      if (axiosErr.response?.status === 500) {
        toast.error(
          "Something went wrong on our server. Please try again later."
        );
      }

      setError(axiosErr.response?.data ?? axiosErr.message);
      throw err;
    } finally {
      // Only update loading if this controller is still the active one
      if (controllerRef.current === controller) {
        setLoading(false);
        controllerRef.current = null;
      }
    }
  };

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setLoading(false);
    }
  }, []);

  return { call, abort, data, loading, error };
}
