import { combineReducers } from '@reduxjs/toolkit';

import { burgerReducer } from './burgerSlice';
import { burgerConstructor } from './constructorSlice';
import { feedSlice } from './feedSlice';
import { userReducer } from './userSlice';

export const rootReducer = combineReducers({
  burger: burgerReducer,
  burgerConstructor: burgerConstructor,
  feed: feedSlice,
  user: userReducer,
});
