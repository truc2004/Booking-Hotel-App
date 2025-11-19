export type Hotel = {
  hotel_id: string;
  name: string;
  addresses?: {
    province?: string;
    district?: string;
    detailAddress?: string;
  };
  phone?: string;
  email?: string;
  description?: string;
  check_in_time?: string;
  check_out_time?: string;
  status?: 'active' | 'inactive' | 'available' | 'fully_booked';
  created_at?: string; // hoặc Date nếu muốn dùng Date object
  updated_at?: string; // hoặc Date
};
