import { AppHeader, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { ModalUI, Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import {
  getIngredients,
  getIngredientsSelector,
  getIsLoadingSelector,
  getErrorSelector,
} from '../../services/burgerSlice';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredientsSelector);
  const isIngredientsLoading = useSelector(getIsLoadingSelector);
  const ingredientsError = useSelector(getErrorSelector);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(getIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const handleCloseModal = (): void => {
    void navigate(-1);
  };
  return (
    <Routes>
      <Route path="/" element={<ConstructorPage />} />
      <Route path="/feed" element={<Feed />} />
      <Route
        path="/login"
        element={
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute onlyUnAuth>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <ProtectedRoute onlyUnAuth>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/orders"
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed/:number"
        element={
          <ModalUI title="Информация о заказе" onClose={handleCloseModal}>
            <OrderInfo />
          </ModalUI>
        }
      />
      <Route
        path="/ingredients/:id"
        element={
          <ModalUI title="Детали ингредиента" onClose={handleCloseModal}>
            <IngredientDetails />
          </ModalUI>
        }
      />
      <Route
        path="/profile/orders/:number"
        element={
          <ProtectedRoute>
            <ModalUI title="Информация о заказе" onClose={handleCloseModal}>
              <OrderInfo />
            </ModalUI>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
