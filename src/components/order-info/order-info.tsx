import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getIngredientsSelector } from '../../services/burgerSlice';
import {
  getFeedLoadingSelector,
  getOrderByNumber,
  getOrderByNumberSelector,
} from '../../services/feedSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector(getIngredientsSelector);
  const orderData = useSelector((state) => {
    return getOrderByNumberSelector(state, Number(number));
  });
  const isLoading = useSelector(getFeedLoadingSelector);
  /* Готовим данные для отображения */
  useEffect(() => {
    if (!number) return;
    if (orderData) return;
    void dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number, orderData?.number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsWithCount>(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = (
      Object.values(ingredientsInfo) as (TIngredient & { count: number })[]
    ).reduce((acc: number, item) => acc + item.price * item.count, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
