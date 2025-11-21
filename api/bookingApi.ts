
import axios from "axios";
import { Booking } from "@/types/booking"; 

const API_BASE_URL = "https://hotel-mobile-be.onrender.com/hotel/bookings";
// const API_BASE_URL = "http://localhost:3002/hotel/bookings";

export const bookingApi = {
  async getByAccount(accountId: string): Promise<Booking[]> {
    const res = await axios.get(`${API_BASE_URL}/by-account/${accountId}`);
    return res.data;
  },

   async getById(bookingId: string): Promise<Booking> {
    const res = await axios.get(`${API_BASE_URL}/${bookingId}`);
    return res.data;
  },
};
