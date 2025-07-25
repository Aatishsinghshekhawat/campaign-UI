import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import listReducer from '../features/list/listSlice';
import listItemReducer from '../features/listItem/listItemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    list: listReducer,
    listItem: listItemReducer,
  },
});

