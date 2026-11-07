import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';

type TFeedState = {
  orders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  isLoading: boolean;
  isUserOrdersLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  isLoading: false,
  isUserOrdersLoading: false,
  error: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  return getFeedsApi();
});

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const getUserOrders = createAsyncThunk('feed/getUserOrders', async () => {
  return getOrdersApi();
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getOrdersSelector: (state) => state.orders,
    getTotalSelector: (state) => state.total,
    getTotalTodaySelector: (state) => state.totalToday,
    getOrderByNumberSelector: (state) => state.currentOrder,
    getFeedLoadingSelector: (state) => state.isLoading,
    getFeedErrorSelector: (state) => state.error,
    getUserOrdersSelector: (state) => state.userOrders,
    getUserOrdersLoadingSelector: (state) => state.isUserOrdersLoading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0] ?? null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isUserOrdersLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isUserOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isUserOrdersLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки истории заказов';
      });
  },
});

export const {
  getOrdersSelector,
  getUserOrdersSelector,
  getUserOrdersLoadingSelector,
  getTotalSelector,
  getTotalTodaySelector,
  getOrderByNumberSelector,
  getFeedLoadingSelector,
  getFeedErrorSelector,
} = feedSlice.selectors;

export const feedReducer = feedSlice.reducer;
