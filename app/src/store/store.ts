import { configureStore } from '@reduxjs/toolkit';
import feedReducer from './feedSlice';

export const store = configureStore({
  reducer: {
    feed: feedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;