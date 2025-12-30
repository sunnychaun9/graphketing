import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../services/storage';

interface AppSettingsState {
  isDarkMode: boolean;
  searchQuery: string;
  isSyncing: boolean;
}

const initialState: AppSettingsState = {
  isDarkMode: StorageService.getDarkMode(),
  searchQuery: '',
  isSyncing: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      StorageService.saveDarkMode(state.isDarkMode);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      StorageService.saveDarkMode(action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode, setSearchQuery, setSyncing } =
  appSlice.actions;
export default appSlice.reducer;
