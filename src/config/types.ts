import {
  type DraggableSyntheticListeners,
  UniqueIdentifier,
} from '@dnd-kit/core';
import React from 'react';

export interface ConfigColumnInterface {
  // название колонки
  label: string;
  // значение колонки
  value?: string | number;
  // флаг о том что поле является собирательным для значений которые не попали в value
  isCollectively?: boolean;
  // другие пропсы не участвующие в логике
  [key: string]: any;
}

export interface ConfigInterface {
  // поле по которому будут формироваться колонки
  columnField: string;
  // колонки
  columns: ConfigColumnInterface[];
  // уникальное поле для item
  itemUniqKey: string;
  // поле для группировки по разным agile
  groupByField?: string;
}

export type ItemType = { [key: string]: any };

export type ItemsType = Record<UniqueIdentifier, ItemType>;

export interface ConstructorInterface {
  customItemHandle?: boolean;
  renderItem: (args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    transform: any;
    transition: any;
    value: ItemType;
    disabled: boolean;
    handleProps: any;
  }) => React.ReactElement;
  renderContainer: (args: {
    containerMeta: ConfigColumnInterface;
    handleProps: any;
    onRemove: VoidFunction;
    children: any;
  }) => React.ReactElement;
}
