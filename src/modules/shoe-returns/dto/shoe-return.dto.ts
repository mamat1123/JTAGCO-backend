export interface ShoeReturnDto {
  id: string;
  event_shoe_variant_id: string;
  quantity: number;
  returned_by: number;
  returned_at: string;
  reason?: string;
  created_at: string;
  returner_name?: string;
} 