import { createContext } from 'react';
import { ConstructorInterface } from '../../config/types.ts';

export const ConstructorContext = createContext<
  Pick<
    ConstructorInterface,
    'renderItem' | 'renderContainer' | 'hideColumnRemove' | 'hideColumnSorting'
  >
>({
  renderItem: () => <></>,
  renderContainer: () => <></>,
  hideColumnRemove: false,
  hideColumnSorting: false,
});
