import { ConfigInterface } from './types.ts';

export const meta: ConfigInterface = {
  columnField: 'status',
  columns: [
    {
      label: 'Первая колонка',
      value: 0,
    },
    {
      label: 'Вторая колонка',
      value: 1,
    },
    {
      label: 'Третья колонка',
      value: 2,
    },
    {
      label: 'Четвертая колонка',
      value: 3,
    },
    {
      label: 'Остальные',
      isCollectively: true,
    },
  ],
};
