import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  getUserOrders,
  getUserOrdersSelector,
  getUserOrdersLoadingSelector,
} from '../../services/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrdersSelector);
  const isLoading = useSelector(getUserOrdersLoadingSelector);

  useEffect(() => {
    void dispatch(getUserOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
