import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import listReducer from '../features/list/listSlice';
import listItemReducer from '../features/listItem/listItemSlice';
import templateReducer from '../features/template/templateSlice';
import campaignReducer from '../features/campaign/campaignSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    list: listReducer,
    listItems: listItemReducer,
    template: templateReducer,
    campaign: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
  devTools: import.meta.env.MODE !== 'production',
});