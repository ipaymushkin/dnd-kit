import { useSortable } from '@dnd-kit/sortable';
import { useMountStatus } from '../../hooks/useMountStatus.ts';
import { Item } from '../Item';
import { ConfigColumnInterface, ItemType } from '../../config/types.ts';
import { memo, useContext } from 'react';
import { ConstructorContext } from '../../context.tsx';

interface SortableItemProps {
  id: string;
  index: number;
  disabled?: boolean;
  item: ItemType;
  containerMeta: ConfigColumnInterface;
}

const SortableItem = memo(
  ({ disabled, id, index, item, containerMeta }: SortableItemProps) => {
    const {
      setNodeRef,
      setActivatorNodeRef,
      listeners,
      isDragging,
      isSorting,
      // over,
      // overIndex,
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
