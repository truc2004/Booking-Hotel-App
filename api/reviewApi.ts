import { Review } from "../types/review";

const API_URL ="https://hotel-mobile-be.onrender.com/hotel/reviews";  // link deploy
// const API_URL = "http://localhost:3002/hotel/reviews"; // link local


export async function fetchReviews(): Promise<Review[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Lỗi tải reviews!");
  return await res.json();
}


export async function fetchReviewsByRoom(room_id: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}?room_id=${room_id}`);
  if (!res.ok) throw new Error("Lỗi tải reviews!");
  return await res.json();
}

export async function fetchMyReview(
  account_id: string,
  room_id: string
): Promise<Review | null> {
  const res = await fetch(
    `${API_URL}/review?account_id=${account_id}&room_id=${room_id}`
  );

  if (res.status === 404) return null;

  if (!res.ok) throw new Error("Lỗi tải review của bạn!");
  return await res.json();
}

export async function createReviewApi(params: {
  account_id: string;
  room_id: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || "Lỗi tạo review!");
  }

  return await res.json();
}

export async function updateReviewApi(params: {
  account_id: string;
  room_id: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const res = await fetch(`${API_URL}/review`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || "Lỗi cập nhật review!");
  }

  return await res.json();
}