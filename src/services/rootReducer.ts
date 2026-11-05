import { combineReducers } from '@reduxjs/toolkit';

import { burgerReducer } from './burgerSlice';
import { constructorReducer } from './constructorSlice';

export const rootReducer = combineReducers({
  burger: burgerReducer,
  constructor: constructorReducer,
});
