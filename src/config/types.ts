import {
  CancelDrop,
  type DraggableSyntheticListeners,
  Modifiers,
  UniqueIdentifier,
} from '@dnd-kit/core';
import React, { ReactNode } from 'react';

export interface ConfigColumnInterface {
  // название колонки
  label: string;
  // значение колонки
  value?: string | number;
  // флаг о том что поле является собирательным для значений которые не попали в value
  isCollectively?: boolean;
}

export interface ConfigInterface {
  // поле по которому будут формироваться колонки
  columnField: string;
  // колонки
  columns: ConfigColumnInterface[];
  // уникальное поле для item
  itemUniqKey: string;
}

export type ItemType = { [key: string]: any };

export type ItemsType = Record<UniqueIdentifier, ItemType>;

export interface ConstructorInterface {
  cancelDrop?: CancelDrop;
  getContainerStyle?: (args: {
    container: ConfigColumnInterface;
    index: number;
  }) => React.CSSProperties;
  getItemStyles?: (args: {
    item: ItemType;
    index: number;
    overIndex: number;
    isDragging: boolean;
    container: ConfigColumnInterface;
    isSorting: boolean;
    isDragOverlay: boolean;
  }) => React.CSSProperties;
  wrapperStyle?: (args: { index: number }) => React.CSSProperties;
  handle?: boolean;
  renderItem?: any;
  modifiers?: Modifiers;
  scrollable?: boolean;
}
