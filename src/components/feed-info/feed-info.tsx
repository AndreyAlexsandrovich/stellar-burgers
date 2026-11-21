import { FeedInfoUI } from '@ui';

import {
  getOrdersSelector,
  getTotalSelector,
  getTotalTodaySelector,
  getFeedLoadingSelector,
  getFeedErrorSelector,
} from '../../services/feedSlice';
import { useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(getOrdersSelector);
  const total = useSelector(getTotalSelector);
  const totalToday = useSelector(getTotalTodaySelector);
  const isLoading = useSelector(getFeedLoadingSelector);
  const error = useSelector(getFeedErrorSelector);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading,
    error,
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
