import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable';
import { Container, ContainerProps } from '../Container';
import { memo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { AnyType, ItemsType } from '../../config/types.ts';

const animateLayoutChanges: AnimateLayoutChanges = args =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const DroppableContainer = memo(
  ({
    children,
    disabled,
    id,
    items,
    ...props
  }: ContainerProps & {
    disabled?: boolean;
    id: string;
    items: ItemsType[];
  }) => {
    const {
      active,
      attributes,
      isDragging,
      listeners,
      over,
      setNodeRef,
      transition,
      transform,
    } = useSortable({
      id,
      data: {
        type: 'container',
        children: items,
      },
      animateLayoutChanges,
    });
    const isOverContainer = over
      ? (id === over.id && active?.data.current?.type !== 'container') ||
        items.includes(over.id as AnyType)
      : false;

    return (
      <Container
        ref={disabled ? undefined : setNodeRef}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
          opacity: isDragging ? 0.5 : undefined,
        }}
        hover={isOverContainer}
        handleProps={{
          ...attributes,
          ...listeners,
        }}
        {...props}
      >
        {children}
      </Container>
    );
  },
);

export { DroppableContainer };
