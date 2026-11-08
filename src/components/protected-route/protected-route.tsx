import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { getUserSelector, getIsAuthCheckedSelector } from '../../services/userSlice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(getUserSelector);
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to="/" replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
