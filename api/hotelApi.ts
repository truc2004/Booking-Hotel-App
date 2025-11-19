import { Hotel } from "@/types/hotel";

const API_URL ="https://hotel-mobile-be.onrender.com/hotel/hotels"; 
// const API_URL = "http://localhost:3001/hotel/hotels";

export async function fetchHotelById(hotel_id: string): Promise<Hotel> {
  const res = await fetch(`${API_URL}/hotelDetail?hotel_id=${hotel_id}`);
  if (!res.ok) throw new Error("Lỗi tải thông tin khách sạn!");
  return await res.json();
}
