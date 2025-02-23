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
  renderItem(): React.ReactElement;
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
  wrapperStyle,
  item,
  containerMeta,
  getItemStyles,
}: SortableItemProps & {
  getItemStyles: ConstructorInterface['getItemStyles'];
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

  /*
  container: getContainerMetaByContainerId(findContainer(item.id)),
          overIndex: -1,
          index: getIndex(item.id),
          item: getItemByItemId(item.id),
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
   */
  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
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
