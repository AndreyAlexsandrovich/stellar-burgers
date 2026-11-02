import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../utils/burger-api';

import type { TIngredient } from '../utils/types';

type TIngredientState = {
  burgers: TIngredient[];
  isLoading: boolean;
  error: string | null;
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
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.burgers.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgers = state.burgers.filter((b) => b._id !== action.payload);
    },
    clearIngredients(state) {
      state.burgers = [];
    },
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
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.burgers = action.payload;
      });
  },
});

export const { addIngredient, removeIngredient, clearIngredients, setIngredients } =
  productSlice.actions;

export const { getIngredientsSelector, getIsLoadingSelector, getErrorSelector } =
  productSlice.selectors;

export const burgerReducer = productSlice.reducer;
