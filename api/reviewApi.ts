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
