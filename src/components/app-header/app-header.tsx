import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/userSlice';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(getUserSelector);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
