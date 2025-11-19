export interface Room {
  room_id: string;
  hotel_id: string;
  price_per_night: number;
  extra_fee_adult: number;
  extra_fee_child: number;
  images: string[];
  amenities: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: "available" | "unavailable";
  rate: number,
  bed_count: number
}
