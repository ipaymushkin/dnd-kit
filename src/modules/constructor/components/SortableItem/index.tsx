import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { useMountStatus } from '../../hooks/useMountStatus.ts';
import { Item } from '../Item';
import {
  ConfigColumnInterface,
  ConfigInterface,
  ConstructorInterface,
  ItemType,
} from '../../../../config/types.ts';
import { memo } from 'react';

interface SortableItemProps {
  id: UniqueIdentifier;
  index: number;
  disabled?: boolean;
  getIndex(id: UniqueIdentifier): number;
  item: ItemType;
  containerMeta: ConfigColumnInterface;
}

const SortableItem = memo(
  ({
    disabled,
    id,
    index,
    customItemHandle,
    renderItem,
    getIndex,
    item,
    containerMeta,
    getItemStyles,
    itemCardLabelKey,
  }: SortableItemProps & {
    getItemStyles: ConstructorInterface['getItemStyles'];
    renderItem: ConstructorInterface['renderItem'];
    itemCardLabelKey?: ConfigInterface['itemCardLabelKey'];
    customItemHandle?: ConstructorInterface['customItemHandle'];
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
        customItemHandle={customItemHandle}
        handleProps={
          customItemHandle ? { ref: setActivatorNodeRef } : undefined
        }
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
        itemCardLabelKey={itemCardLabelKey}
      />
    );
  },
);

export { SortableItem };
