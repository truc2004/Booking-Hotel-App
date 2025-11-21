// src/types/booking.ts

export type BookingStatus = "upcoming" | "completed" | "cancelled" | string;

export interface BookingUserInfo {
  full_name: string;
  phone: string;
  email: string;
}

export interface BookingHotelInfo {
  name: string;
  address: string;
}

export interface Booking {
  _id?: string;              // Mongo _id (nếu BE trả về)
  booking_id: string;        // booking_id trong schema

  account_id: string;
  room_id: string;

  user_booking_info?: BookingUserInfo | null;
  hotel_info?: BookingHotelInfo | null;

  num_adults: number;
  num_children: number;

  booking_date: string | Date;

  extra_fee: number;
  room_price: number;
  total_price: number;

  note?: string;
  status: BookingStatus;

  created_at?: string | Date;
  updated_at?: string | Date;
}
