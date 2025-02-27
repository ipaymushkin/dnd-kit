import { type DraggableSyntheticListeners } from '@dnd-kit/core';
import React from 'react';

export type AnyType = 'any';

export interface ConfigColumnInterface {
  // название колонки
  label: string;
  // значение колонки
  value?: string | number;
  // флаг о том что поле является собирательным для значений которые не попали в value
  isCollectively?: boolean;
  // другие пропсы не участвующие в логике
  [key: string]: AnyType;
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

export type ItemType = { [key: string]: AnyType };

export type ItemsType = Record<string, ItemType>;

export interface onElementDragEndInterface {
  container: ConfigColumnInterface;
  element: ItemType;
  oldIndex: number;
  newIndex: number;
}

export interface renderContainerInterface {
  containerMeta: ConfigColumnInterface;
  handleProps: AnyType;
  onRemove: VoidFunction;
  children: AnyType;
}

export interface renderItemInterface {
  dragOverlay: boolean;
  dragging: boolean;
  sorting: boolean;
  index: number | undefined;
  fadeIn: boolean;
  listeners: DraggableSyntheticListeners;
  ref: React.Ref<HTMLElement>;
  transform: AnyType;
  transition: AnyType;
  value: ItemType;
  disabled: boolean;
  handleProps: AnyType;
}

export interface ConstructorInterface {
  customItemHandle?: boolean;
  renderItem: (args: renderItemInterface) => React.ReactElement;
  renderContainer: (args: renderContainerInterface) => React.ReactElement;
  onContainerDragEnd?: (value: ConfigColumnInterface) => void;
  onElementDragEnd?: (args: onElementDragEndInterface) => void;
}

export interface DndElementInterface {
  id: string | number;
  data: {
    [key: string]: AnyType;
  };
  rect: {
    [key: string]: AnyType;
  };
}
