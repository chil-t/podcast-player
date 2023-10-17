import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EpisodeResults } from '@/pages/episode';

interface FeedState {
  data: EpisodeResults | null;
  isLoading: boolean;
  feedID: string;
  author: string | null;
}

const initialState: FeedState = {
  data: null,
  isLoading: true,
  feedID: '',
  author: null,
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
    storeFeedID: (state, action: PayloadAction<string>) => {
      state.feedID = action.payload;
    },
    setAuthor: (state, action: PayloadAction<string | null>) => {
      state.author = action.payload;
    },
  },
});

export const { setData, setLoading, storeFeedID, setAuthor } = feedSlice.actions;
export default feedSlice.reducer;