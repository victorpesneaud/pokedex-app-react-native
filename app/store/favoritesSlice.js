import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.find(p => p.name === action.payload.name);
      if (!exists) {
        state.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      return state.filter(p => p.name !== action.payload.name);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;