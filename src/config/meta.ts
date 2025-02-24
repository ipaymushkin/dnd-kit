import { ConfigInterface } from './types.ts';

export const meta: ConfigInterface = {
  columnField: 'status',
  itemUniqKey: 'id',
  itemCardLabelKey: 'id',
  columns: [
    {
      label: 'Первая колонка',
      value: 'first',
    },
    {
      label: 'Вторая колонка',
      value: 'second',
    },
    {
      label: 'Третья колонка',
      value: 'third',
    },
    {
      label: 'Четвертая колонка',
      value: 'fourth',
    },
    {
      label: 'Остальные',
      isCollectively: true,
    },
  ],
};
