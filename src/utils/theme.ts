export const lightTheme = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  primary: '#6200EE',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  error: '#B00020',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  cardShadow: '#000000',

  // Kanban specific
  todoColumn: '#FFE0B2',
  inProgressColumn: '#BBDEFB',
  doneColumn: '#C8E6C9',
  todoColumnDark: '#FFB74D',
  inProgressColumnDark: '#64B5F6',
  doneColumnDark: '#81C784',
};

export const darkTheme = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#BB86FC',
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  error: '#CF6679',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  success: '#81C784',
  warning: '#FFB74D',
  cardShadow: '#000000',

  // Kanban specific
  todoColumn: '#4A3728',
  inProgressColumn: '#1A3A4A',
  doneColumn: '#2A4A2A',
  todoColumnDark: '#8B5E34',
  inProgressColumnDark: '#2E6B8A',
  doneColumnDark: '#4A8A4A',
};

export type Theme = typeof lightTheme;

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};
