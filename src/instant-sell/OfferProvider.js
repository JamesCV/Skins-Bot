import { createContext } from 'react';

export const SelectedItemsContext = createContext({
  selectedItems: [],
  setSelectedItems: () => {},
});
