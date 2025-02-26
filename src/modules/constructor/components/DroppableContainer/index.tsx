import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable';
import { Container, ContainerProps } from '../Container';
import { UniqueIdentifier } from '@dnd-kit/core';
import React, { memo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { ItemsType } from '../../../../config/types.ts';

const animateLayoutChanges: AnimateLayoutChanges = args =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const DroppableContainer = memo(
  ({
    children,
    disabled,
    id,
    items,
    style,
    ...props
  }: ContainerProps & {
    disabled?: boolean;
    id: UniqueIdentifier;
    items: ItemsType[];
    style?: React.CSSProperties;
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
        items.includes(over.id)
      : false;

    return (
      <Container
        ref={disabled ? undefined : setNodeRef}
        style={{
          ...style,
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
