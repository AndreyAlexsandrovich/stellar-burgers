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
import { Routes, Route } from 'react-router-dom';

import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const ingredients: TIngredient[] = [];
  const isIngredientsLoading = false;
  const ingredientsError = null;

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
  return (
    <Routes>
      <Route path="/" element={<ConstructorPage />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/orders" element={<ProfileOrders />} />
      <Route
        path="/feed/:number"
        element={
          <ModalUI title="Информация о заказе">
            <OrderInfo />
          </ModalUI>
        }
      />
      <Route
        path="/ingredients/:id"
        element={
          <ModalUI title="Детали градиента">
            <IngredientDetails />
          </ModalUI>
        }
      />
      <Route
        path="/profile/orders/:number"
        element={
          <ModalUI title="Информация о заказе">
            <OrderInfo />
          </ModalUI>
        }
      />
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
};
