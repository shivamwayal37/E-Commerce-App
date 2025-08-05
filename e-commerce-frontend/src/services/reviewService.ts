import axios from 'axios';
import { Review, ReviewFormValues } from '../types/review';

export const reviewService = {
  async getReviews(productId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`/api/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  async addReview(productId: string, review: ReviewFormValues): Promise<Review> {
    try {
      const formData = new FormData();
      formData.append('rating', review.rating.toString());
      formData.append('comment', review.comment);
      if (review.images) {
        for (let i = 0; i < review.images.length; i++) {
          formData.append('images', review.images[i]);
        }
      }

      const response = await axios.post(`/api/products/${productId}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  async updateReview(reviewId: string, review: ReviewFormValues): Promise<Review> {
    try {
      const formData = new FormData();
      formData.append('rating', review.rating.toString());
      formData.append('comment', review.comment);
      if (review.images) {
        for (let i = 0; i < review.images.length; i++) {
          formData.append('images', review.images[i]);
        }
      }

      const response = await axios.put(`/api/reviews/${reviewId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  async deleteReview(reviewId: string): Promise<void> {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  async getAverageRating(productId: string): Promise<number> {
    try {
      const response = await axios.get(`/api/products/${productId}/reviews/average-rating`);
      return response.data;
    } catch (error) {
      console.error('Error fetching average rating:', error);
      throw error;
    }
  },
};
