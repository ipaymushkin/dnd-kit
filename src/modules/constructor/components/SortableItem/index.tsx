import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { useMountStatus } from '../../hooks/useMountStatus.ts';
import { Item } from '../Item';
import {
  ConfigColumnInterface,
  ConstructorInterface,
  ItemType,
} from '../../../../config/types.ts';
import { memo, useContext } from 'react';
import { ConstructorContext } from '../../context.tsx';

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
    getIndex,
    item,
    containerMeta,
  }: SortableItemProps) => {
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
    const { customItemHandle } = useContext(ConstructorContext);
    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
      <Item
        ref={disabled ? undefined : setNodeRef}
        value={item}
        container={containerMeta}
        dragging={isDragging}
        sorting={isSorting}
        handleProps={
          customItemHandle ? { ref: setActivatorNodeRef } : undefined
        }
        index={index}
        transition={transition}
        transform={transform}
        fadeIn={mountedWhileDragging}
        listeners={listeners}
      />
    );
  },
);

export { SortableItem };
