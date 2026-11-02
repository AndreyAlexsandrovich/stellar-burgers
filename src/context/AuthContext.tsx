// import {    useSelector } from '../services/store';
// import {  Preloader  } from '../components/ui/preloader';
// import {    Navigate    } from 'react-router';
// import {    isAuthCheckedSelector, userDataSelector } from '../services/selectors';

// type ProtectedRouteProps = {
//     onlyUnAuth?: boolean;
//     children: React.ReactElement;
// }

// export const ProtectedRoute =   ({onlyUnAuth,   children}:  ProtectedRouteProps) => {
//     const isAuthChecked = useSelector(isAuthCheckedSelector);
//     const user = useSelector(userDataSelector);

//     if (!isAuthChecked) {
//         return <Preloader />
//     }

//     if (!onlyUnAuth && !user) {
//         return <Navigate replace to="/register"  />
//     }

//        if (onlyUnAuth && user) {
//         return <Navigate replace to="/"  />
//     }

//     return children;
// }
