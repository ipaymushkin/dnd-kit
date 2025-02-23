import { UniqueIdentifier } from '@dnd-kit/core';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useMountStatus } from '../../hooks/useMountStatus.ts';
import { Item } from '../Item';
import {
  ConfigColumnInterface,
  ConstructorInterface,
  ItemType,
} from '../../../../config/types.ts';

interface SortableItemProps {
  id: UniqueIdentifier;
  index: number;
  handle: boolean;
  disabled?: boolean;
  getIndex(id: UniqueIdentifier): number;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
  item: ItemType;
  containerMeta: ConfigColumnInterface;
}

const SortableItem = ({
  disabled,
  id,
  index,
  handle,
  renderItem,
  getIndex,
  item,
  containerMeta,
  getItemStyles,
}: SortableItemProps & {
  getItemStyles: ConstructorInterface['getItemStyles'];
  renderItem: ConstructorInterface['renderItem'];
}) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={item}
      container={containerMeta}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      style={
        getItemStyles &&
        getItemStyles({
          index,
          item,
          isDragging,
          isSorting,
          overIndex: over ? getIndex(over.id) : overIndex,
          container: containerMeta,
          isDragOverlay: false,
        })
      }
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  );
};

export { SortableItem };
