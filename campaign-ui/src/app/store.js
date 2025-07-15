import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/userSlice'; 
import listReducer from '../features/list/listSlice';
import listItemReducer from '../features/listItem/listItemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    lists: listReducer,
    listItem: listItemReducer,
  },
});

