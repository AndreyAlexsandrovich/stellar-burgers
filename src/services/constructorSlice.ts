import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
  nanoid,
} from '@reduxjs/toolkit';

import { orderBurgerApi, type TNewOrderResponse } from '../utils/burger-api';

import type {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TConstructorState as TBaseConstructorState,
} from '../utils/types';

type TConstructorState = TBaseConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TConstructorState = {
  bun: null,
  orderRequest: false,
  orderModalData: null,
  ingredients: [],
};

export const orderBurger = createAsyncThunk<TNewOrderResponse, string[]>(
  'constructor/order',
  async (ids: string[]) => {
    return orderBurgerApi(ids);
  }
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: nanoid() } };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((i) => i.id !== action.payload);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    handleCloseOrderModal: (state) => {
      state.orderModalData = null;
    },
    moveIngredientsUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0) return;
      const [item] = state.ingredients.splice(index, 1);
      state.ingredients.splice(index - 1, 0, item);
    },
    moveIngredientsDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= state.ingredients.length - 1) return;
      const [item] = state.ingredients.splice(index, 1);
      state.ingredients.splice(index + 1, 0, item);
    },
  },
  selectors: {
    getConstructorSelector: (state) => state,
    getOrderRequestSelector: (state) => state.orderRequest,
    getOrderModalDataSelector: (state) => state.orderModalData,
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.bun = null;
        state.ingredients = [];
      });
  },
});

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  handleCloseOrderModal,
  moveIngredientsUp,
  moveIngredientsDown,
} = constructorSlice.actions;

export const {
  getConstructorSelector,
  getOrderRequestSelector,
  getOrderModalDataSelector,
} = constructorSlice.selectors;

export const burgerConstructor = constructorSlice.reducer;
