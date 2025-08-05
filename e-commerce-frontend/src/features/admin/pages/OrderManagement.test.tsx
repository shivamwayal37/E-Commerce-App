import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import OrderManagement from './OrderManagement';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../../../store/orderSlice';

jest.mock('../../../store/orderSlice', () => ({
  fetchOrders: jest.fn().mockResolvedValue({ type: 'orders/fetchOrders/fulfilled' }),
  updateOrderStatus: jest.fn().mockResolvedValue({ type: 'orders/updateOrderStatus/fulfilled' }),
  deleteOrder: jest.fn().mockResolvedValue({ type: 'orders/deleteOrder/fulfilled' }),
}));

describe('OrderManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches orders on mount', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrderManagement />
        </BrowserRouter>
      </Provider>
    );

    expect(fetchOrders).toHaveBeenCalled();
  });

  it('updates order status', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrderManagement />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/cancel/i));

    await waitFor(() => {
      expect(updateOrderStatus).toHaveBeenCalledWith({
        orderId: expect.any(String),
        status: 'cancelled',
      });
    });
  });

  it('deletes order', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrderManagement />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('delete-order'));

    await waitFor(() => {
      expect(deleteOrder).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it('handles errors gracefully', async () => {
    (fetchOrders as unknown as jest.Mock).mockRejectedValue({ error: 'Failed to fetch orders' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <OrderManagement />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch orders/i)).toBeInTheDocument();
    });
  });
});
