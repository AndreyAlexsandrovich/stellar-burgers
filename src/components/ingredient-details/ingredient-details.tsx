import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import {
  getIngredientsSelector,
  getIsLoadingSelector,
} from '../../services/burgerSlice';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(getIngredientsSelector);
  const isIngredientsLoading = useSelector(getIsLoadingSelector);

  const ingredientData = ingredients.find((item) => item._id === id);
  if (isIngredientsLoading) {
    return <Preloader />;
  }
  if (!ingredientData) return <p>ингредиент не найден</p>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
