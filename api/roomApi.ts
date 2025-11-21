import { Room } from "../types/room";
import axios from "axios";

const API_BASE_URL ="https://hotel-mobile-be.onrender.com/hotel/rooms"; 
// const API_BASE_URL ="http://localhost:3002/hotel/rooms";

export async function fetchRooms(): Promise<Room[]> {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Lỗi tải phòng!");
  return await res.json();
}

export async function fetchRoomById(room_id: string): Promise<Room> {
  const res = await fetch(`${API_BASE_URL}/roomDetail?room_id=${room_id}`);
  if (!res.ok) throw new Error("Lỗi tải phòng!");
  return await res.json();
}