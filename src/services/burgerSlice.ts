import {
  createSlice,
  type PayloadAction,
  type SerializedError,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import { getIngredientsApi } from '../utils/burger-api';

import type { TIngredient } from '../utils/types';

type TIngredientState = {
  burgers: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TIngredientState = {
  burgers: [],
  isLoading: false,
  error: null,
};

export const getIngredients = createAsyncThunk('ingredients/getAll', async () => {
  return getIngredientsApi();
});

export const productSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.burgers = action.payload;
    },
  },
  selectors: {
    getIngredientsSelector: (state) => state.burgers,
    getIsLoadingSelector: (state) => state.isLoading,
    getErrorSelector: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.burgers = action.payload;
      });
  },
});

export const { setIngredients } = productSlice.actions;

export const { getIngredientsSelector, getIsLoadingSelector, getErrorSelector } =
  productSlice.selectors;

export const burgerReducer = productSlice.reducer;
