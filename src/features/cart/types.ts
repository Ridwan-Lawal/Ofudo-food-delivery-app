export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  image_url: string;
  price: number;
  foodId: string;
}

export interface FoodDetailType {
  name: string;
  price: number;
  image_url: string | null;
}
