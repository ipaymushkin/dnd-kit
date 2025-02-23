import { ConfigInterface } from '../../../config/types.ts';

export const getColumnsFromMeta = (meta: ConfigInterface) => {
  const set = new Set();
  meta.columns.forEach(column => {
    if ('value' in column) {
      set.add(column.value);
    }
  });
  return Array.from(set);
};
