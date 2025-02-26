import React, { forwardRef, memo, useContext, useEffect } from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import {
  ConfigColumnInterface,
  ConfigInterface,
  ConstructorInterface,
  ItemType,
} from '../../../../config/types.ts';
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
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: ItemType;
  container: ConfigColumnInterface;
} & {
  itemCardLabelKey?: ConfigInterface['itemCardLabelKey'];
  customItemHandle?: ConstructorInterface['customItemHandle'];
};

export const Item = memo(
  forwardRef<HTMLLIElement, Props>(
    (
      {
        dragOverlay,
        dragging,
        disabled = false,
        fadeIn,
        customItemHandle,
        handleProps,
        // height,
        index,
        listeners,
        sorting,
        style,
        transition,
        transform,
        value,
        itemCardLabelKey,
        ...props
      },
      ref,
    ) => {
      const { renderItem } = useContext(ConstructorContext);

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      let transformStr = undefined;
      if (transform) {
        transformStr = `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
      }

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
          {renderItem
            ? renderItem({
                dragOverlay: Boolean(dragOverlay),
                dragging: Boolean(dragging),
                sorting: Boolean(sorting),
                index,
                fadeIn: Boolean(fadeIn),
                listeners,
                ref,
                style,
                transform,
                transition,
                value,
                disabled,
                handleProps,
              })
            : value[itemCardLabelKey]}
        </div>
      );
    },
  ),
);
