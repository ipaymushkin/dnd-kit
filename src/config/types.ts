import { CancelDrop, Modifiers, UniqueIdentifier } from '@dnd-kit/core';
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
}

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

export interface ConstructorInterface {
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  getItemStyles?: (args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }) => React.CSSProperties;
  wrapperStyle?: (args: { index: number }) => React.CSSProperties;
  handle?: boolean;
  renderItem?: (data: any) => ReactNode;
  modifiers?: Modifiers;
  scrollable?: boolean;
}
