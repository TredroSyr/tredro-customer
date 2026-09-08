export interface CartItem {
  product_id: number;
  product_name: string;
  unit_name: string;
  price: string | null;
  quantity: number;
  image: string | null;
}
