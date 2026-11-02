import { combineReducers } from '@reduxjs/toolkit';

import { burgerReducer } from './burgerSlice';

export const rootReducer = combineReducers({
  burger: burgerReducer,
});
