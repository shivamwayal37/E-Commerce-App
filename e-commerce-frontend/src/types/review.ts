export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormValues {
  rating: number;
  comment: string;
  images?: FileList;
}

export interface ReviewState {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  isLoading: boolean;
  error: string | null;
}
