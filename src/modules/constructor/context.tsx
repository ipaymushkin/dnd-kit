import { createContext } from 'react';
import { ConstructorInterface } from '../../config/types.ts';

export const ConstructorContext = createContext<
  Pick<ConstructorInterface, 'renderItem' | 'renderContainer'>
>({
  renderItem: () => <></>,
  renderContainer: () => <></>,
});
