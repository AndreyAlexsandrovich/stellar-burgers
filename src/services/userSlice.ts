import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TRegisterData,
  type TLoginData,
} from '../utils/burger-api';
import { setCookie, getCookie } from '../utils/cookie';

import type { TUser } from '../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const res = await loginUserApi(data);
  localStorage.setItem('refreshToken', res.refreshToken);
  setCookie('accessToken', res.accessToken);
  return res.user;
});

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  if (!getCookie('accessToken')) {
    return null;
  }
  const res = await getUserApi();
  return res.user;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserSelector: (state) => state.user,
    getIsAuthCheckedSelector: (state) => state.isAuthChecked,
    getUserLoadingSelector: (state) => state.isLoading,
    getUserErrorSelector: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка обновления профиля';
      });
  },
});

export const {
  getUserSelector,
  getIsAuthCheckedSelector,
  getUserLoadingSelector,
  getUserErrorSelector,
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
