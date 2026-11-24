import { expect, test, describe } from '@jest/globals';

import {
  initialState,
  addIngredient,
  removeIngredient,
  clearConstructor,
  handleCloseOrderModal,
  moveIngredientsUp,
  moveIngredientsDown,
  burgerConstructor,
  orderBurger,
} from '../constructorSlice';

import type { SerializedError } from '@reduxjs/toolkit';

const bun = {
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
};

const filling = {
  _id: '6acd6b8163765e9acf0bd9ef',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://norma.ffapi.ru/images/meat-04.png',
  image_large: 'https://norma.ffapi.ru/images/meat-04-large.png',
  image_mobile: 'https://norma.ffapi.ru/images/meat-04-mobile.png',
};

const sauce = {
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
};

describe('тест конструктора', () => {
  test('добавление булки в конструктор', () => {
    const initialBurgerState = {
      ...initialState,
      ingredients: [...initialState.ingredients],
    };
    const action = addIngredient(bun);
    const newState = burgerConstructor(initialBurgerState, action);

    expect(newState.bun).not.toBeNull();
    expect(newState.bun).toMatchObject({
      _id: bun._id,
      name: bun.name,
      type: 'bun',
      price: bun.price,
    });

    expect(newState.bun?.id).toEqual(expect.any(String));
    expect(newState.ingredients).toHaveLength(0);

    expect(initialBurgerState.bun).toBeNull();
    expect(initialBurgerState.ingredients).toHaveLength(0);
  });

  test('не изменяет состояние при неизвестном экшене', () => {
    const initialBurgerState = {
      ...initialState,
      ingredients: [...initialState.ingredients],
    };
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = burgerConstructor(initialBurgerState, action);

    expect(newState).toEqual(initialBurgerState);
  });

  test('добавление начинки в конструктор', () => {
    const initialBurgerState = {
      ...initialState,
      ingredients: [...initialState.ingredients],
    };
    const action = addIngredient(filling);
    const newState = burgerConstructor(initialBurgerState, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject({
      _id: filling._id,
      name: filling.name,
      type: 'main',
      price: filling.price,
    });

    expect(newState.ingredients[0].id).toEqual(expect.any(String));
    expect(newState.bun).toBeNull();
    expect(initialBurgerState.bun).toBeNull();
    expect(initialBurgerState.ingredients).toHaveLength(0);
  });

  test('добавление соуса в конструктор', () => {
    const initialBurgerState = {
      ...initialState,
      ingredients: [...initialState.ingredients],
    };
    const action = addIngredient(sauce);
    const newState = burgerConstructor(initialBurgerState, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject({
      _id: sauce._id,
      name: sauce.name,
      type: 'sauce',
      price: sauce.price,
    });
    expect(newState.ingredients[0].id).toEqual(expect.any(String));
    expect(newState.bun).toBeNull();
    expect(initialBurgerState.bun).toBeNull();
    expect(initialBurgerState.ingredients).toHaveLength(0);
  });

  test('удаление ингредиента из конструктора', () => {
    const stateWithFilling = burgerConstructor(
      {
        ...initialState,
        ingredients: [...initialState.ingredients],
      },
      addIngredient(filling)
    );
    const stateWithTwo = burgerConstructor(stateWithFilling, addIngredient(sauce));

    const idToRemove = stateWithFilling.ingredients[0].id;

    const newState = burgerConstructor(stateWithTwo, removeIngredient(idToRemove));

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients.find((i) => i.id === idToRemove)).toBeUndefined();
    expect(newState.ingredients[0]).toMatchObject({
      _id: sauce._id,
      name: sauce.name,
      type: 'sauce',
    });
    expect(newState.bun).toBeNull();
    expect(stateWithTwo.ingredients).toHaveLength(2);
  });

  test('очистка конструктора', () => {
    const stateWithBunAndFilling = burgerConstructor(
      burgerConstructor(initialState, addIngredient(bun)),
      addIngredient(filling)
    );
    expect(stateWithBunAndFilling.bun).not.toBeNull();
    expect(stateWithBunAndFilling.ingredients).toHaveLength(1);

    const newState = burgerConstructor(stateWithBunAndFilling, clearConstructor());
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);

    expect(stateWithBunAndFilling.bun).not.toBeNull();
    expect(stateWithBunAndFilling.ingredients).toHaveLength(1);
  });

  test('Закрывает модальные окна заказа', () => {
    const stateWithOrder = {
      ...initialState,
      ingredients: [...initialState.ingredients],
      orderModalData: {
        _id: 'order-id',
        status: 'done',
        name: 'test-order',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345,
        ingredients: [],
      },
    };

    const newState = burgerConstructor(stateWithOrder, handleCloseOrderModal());
    expect(newState.orderModalData).toBeNull();
  });

  test('включает загрузку при orderBurger.pending', () => {
    const action = { type: orderBurger.pending.type };
    const newState = burgerConstructor(initialState, action);

    expect(newState.orderRequest).toBe(true);
  });

  test('сохраняет номер заказа и очищает конструктор при orderBurger.fulfilled', () => {
    const bunWithId = { ...bun, id: 'test-bun-id' };
    const fillingWithId = { ...filling, id: 'test-filling-id' };

    const stateWithBurger = {
      ...initialState,
      bun: bunWithId,
      ingredients: [fillingWithId],
    };

    const mockBurgerResponse = {
      success: true,
      order: { number: '6acd6b8163765e371c0bd9eb' },
    };
    const action = { type: orderBurger.fulfilled.type, payload: mockBurgerResponse };
    const newState = burgerConstructor(stateWithBurger, action);

    expect(newState.orderRequest).toBe(false);
    expect(newState.orderModalData).toEqual({ number: '6acd6b8163765e371c0bd9eb' });
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });

  test('сохраняет ошибку при orderBurger.rejected', () => {
    const mockError: SerializedError = { message: 'Ошибка оформления заказа' };
    const action = { type: orderBurger.rejected.type, error: mockError };
    const newState = burgerConstructor(initialState, action);

    expect(newState.orderRequest).toBe(false);
  });

  test('перемещает ингредиент вверх', () => {
    const stateWithTwo = burgerConstructor(
      burgerConstructor(initialState, addIngredient(filling)),
      addIngredient(sauce)
    );

    const firstId = stateWithTwo.ingredients[0].id;
    const secondId = stateWithTwo.ingredients[1].id;
    const newState = burgerConstructor(stateWithTwo, moveIngredientsUp(1));

    expect(newState.ingredients[0].id).toBe(secondId);
    expect(newState.ingredients[1].id).toBe(firstId);

    expect(newState.ingredients).toHaveLength(2);
    expect(stateWithTwo.ingredients[0].id).toBe(firstId);
    expect(stateWithTwo.ingredients[1].id).toBe(secondId);
  });

  test('перемещает ингредиент вниз', () => {
    const stateWithTwo = burgerConstructor(
      burgerConstructor(initialState, addIngredient(filling)),
      addIngredient(sauce)
    );

    const firstId = stateWithTwo.ingredients[0].id;
    const secondId = stateWithTwo.ingredients[1].id;
    const newState = burgerConstructor(stateWithTwo, moveIngredientsDown(0));

    expect(newState.ingredients[0].id).toBe(secondId);
    expect(newState.ingredients[1].id).toBe(firstId);
    expect(newState.ingredients).toHaveLength(2);
    expect(stateWithTwo.ingredients[0].id).toBe(firstId);
    expect(stateWithTwo.ingredients[1].id).toBe(secondId);
  });
});
