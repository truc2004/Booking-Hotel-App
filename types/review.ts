
export interface Review {
  review_id: string;
  account_id?: string;  
  room_id?: string;   
  rating?: number;
  comment?: string;
  images?: string[];
  status?: string;
  created_at?: string;  
  updated_at?: string; 
}
