import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EpisodeResults } from '@/pages/episode';

interface FeedState {
  data: EpisodeResults | null;
  isLoading: boolean;
}

const initialState: FeedState = {
  data: null,
  isLoading: true,
}

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<EpisodeResults | null>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setData, setLoading } = feedSlice.actions;
export default feedSlice.reducer;