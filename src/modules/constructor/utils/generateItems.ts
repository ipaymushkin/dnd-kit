import { ConfigInterface } from '../../../config/types.ts';
import { getColumnsFromMeta } from './getColumnsFromMeta.ts';
import { otherColumnsValue } from '../const.ts';
import { getRandomInt } from './getRandomInt.ts';

export const generateItems = ({
  meta,
  count = 100,
}: {
  meta: ConfigInterface;
  count?: number;
}) => {
  const columns = getColumnsFromMeta(meta);
  if (columns.length !== meta.columns.length) {
    columns.push(otherColumnsValue);
  }

  return Array(count)
    .fill(0)
    .map((_, idx: number) => {
      const el = {
        id: idx,
        [meta.columnField]: columns[getRandomInt(columns.length)],
      };
      if (meta.groupByField) {
        el[meta.groupByField] = getRandomInt(3);
      }
      return el;
    });
};
