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
  renderItem?: (args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: string;
    transition: string;
    value: ItemType;
  }) => React.ReactElement;
  scrollable?: boolean;
}
