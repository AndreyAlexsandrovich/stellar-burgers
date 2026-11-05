import {
  moveIngredientsUp,
  moveIngredientsDown,
  removeIngredient,
} from '@/services/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import { useDispatch } from '../../services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    dispatch(moveIngredientsDown(index));
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredientsUp(index));
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
