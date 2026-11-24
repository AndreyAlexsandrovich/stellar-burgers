import { expect, test, describe } from '@jest/globals';

import {
  burgerReducer,
  setIngredients,
  initialState,
  getIngredients,
} from '../burgerSlice';

import type { SerializedError } from '@reduxjs/toolkit';
describe('тест список ингредиентов', () => {
  test('не изменяет состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = burgerReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  test('записывает данные при вызове setIngredients', () => {
    const mockIngredients = [
      {
        _id: '6acd6b8163765e371c0bd9eb',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://norma.ffapi.ru/images/bun-02.png',
        image_large: 'https://norma.ffapi.ru/images/bun-02-large.png',
        image_mobile: 'https://norma.ffapi.ru/images/bun-02-mobile.png',
      },
    ];
    const action = setIngredients(mockIngredients);
    const newState = burgerReducer(initialState, action);
    expect(newState.burgers).toEqual(mockIngredients);
  });

  test('включает загрузку при getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const newState = burgerReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('записывает ошибку при getIngredients.rejected', () => {
    const mockError: SerializedError = { message: 'ошибка сети' };
    const action = { type: getIngredients.rejected.type, error: mockError };
    const newState = burgerReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toEqual(mockError);
  });

  test('записывает данные и выключает загрузку при getIngredients.fulfilled ', () => {
    const mockSuccess = [
      {
        _id: '6acd6b8163765e05c50bd9f1',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://norma.ffapi.ru/images/sauce-02.png',
        image_large: 'https://norma.ffapi.ru/images/sauce-02-large.png',
        image_mobile: 'https://norma.ffapi.ru/images/sauce-02-mobile.png',
      },
    ];
    const action = { type: getIngredients.fulfilled.type, payload: mockSuccess };
    const newState = burgerReducer(initialState, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.burgers).toEqual(mockSuccess);
  });
});
