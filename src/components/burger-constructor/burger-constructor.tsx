import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  getConstructorSelector,
  getOrderRequestSelector,
  getOrderModalDataSelector,
  orderBurger,
  handleCloseOrderModal,
  clearConstructor,
} from '../../services/constructorSlice';
import { useSelector, useDispatch } from '../../services/store';
import { getUserSelector } from '../../services/userSlice';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(getConstructorSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderModalDataSelector);
  const user = useSelector(getUserSelector);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(orderBurger(ingredientsIds));
  };

  const closeOrderModal = (): void => {
    dispatch(handleCloseOrderModal());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
