import { ConfigInterface } from './types.ts';

export const meta: ConfigInterface = {
  columnField: 'status',
  itemUniqKey: 'id',
  itemCardLabelKey: 'id',
  // groupByField: 'group_id',
  columns: [
    {
      label: 'Создано',
      value: 'created',
      color: '#6385C7',
    },
    {
      label: 'В процессе',
      value: 'in_progress',
      color: '#FF9F0A',
    },
    {
      label: 'Тестирование',
      value: 'testing',
      color: '#64D2FF',
    },
    {
      label: 'Выполнено',
      value: 'completed',
      color: '#30D158',
    },
    {
      label: 'Ревью',
      value: 'review',
      color: '#BF5AF2',
    },
  ],
};
