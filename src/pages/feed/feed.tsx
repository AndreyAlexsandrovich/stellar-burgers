import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  getOrdersSelector,
  getFeeds,
  getFeedLoadingSelector,
} from '../../services/feedSlice';
import { useSelector, useDispatch } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const dispatch = useDispatch();
  const orders = useSelector(getOrdersSelector);
  const isLoading = useSelector(getFeedLoadingSelector);

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
