import { useState } from "react";

export const useFetch = (baseUrl: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (url: string, options?: RequestInit) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(baseUrl + url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      if (!res.ok) throw new Error("Lỗi khi tải dữ liệu!");
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getData = (url: string) => request(url, { method: "GET" });
  const deleteData = (url: string) => request(url, { method: "DELETE" });
  const put = (url: string, data: any) =>
    request(url, { method: "PUT", body: JSON.stringify(data) });
  const post = (url: string, data: any) =>
    request(url, { method: "POST", body: JSON.stringify(data) });

  return { isLoading, error, getData, deleteData, put, post };
};
