export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}
