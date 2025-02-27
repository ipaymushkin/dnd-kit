import { forwardRef, memo, useContext, useEffect, useMemo } from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import { ConfigColumnInterface, ItemType } from '../../config/types.ts';
import { ConstructorContext } from '../../context.tsx';

type Props = {
  dragOverlay?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  transition?: string | null;
  value: ItemType;
  container: ConfigColumnInterface;
};

export const Item = memo(
  forwardRef<HTMLLIElement, Props>(
    (
      {
        dragOverlay,
        dragging,
        disabled = false,
        fadeIn,
        handleProps,
        // height,
        index,
        listeners,
        sorting,
        transition,
        transform,
        value,
        ...props
      },
      ref,
    ) => {
      const { renderItem, customItemHandle } = useContext(ConstructorContext);

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      const transformStr = useMemo(() => {
        let tr = undefined;
        if (transform) {
          tr = `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
        }
        return tr;
      }, [transform]);

      return (
        <div
          style={{
            display: 'flex',
            transformOrigin: '0 0',
            touchAction: 'manipulation',
            transform: transformStr,
          }}
          ref={ref}
          data-cypress="draggable-item"
          {...(!customItemHandle ? listeners : undefined)}
          {...props}
          tabIndex={!customItemHandle ? 0 : undefined}
        >
          {renderItem({
            dragOverlay: Boolean(dragOverlay),
            dragging: Boolean(dragging),
            sorting: Boolean(sorting),
            index,
            fadeIn: Boolean(fadeIn),
            listeners,
            ref,
            transform,
            transition,
            value,
            disabled,
            handleProps,
          })}
        </div>
      );
    },
  ),
);
