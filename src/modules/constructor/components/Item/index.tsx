import React, { useEffect } from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import {
  ConfigColumnInterface,
  ConfigInterface,
  ConstructorInterface,
  ItemType,
} from '../../../../config/types.ts';
import { Remove } from '../../icons/Remove.tsx';
import Handle from '../../icons/Handle.tsx';
import styled from 'styled-components';

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
  renderItem: ConstructorInterface['renderItem'];
  container: ConfigColumnInterface;
} & {
  itemCardLabelKey?: ConfigInterface['itemCardLabelKey'];
  customItemHandle?: ConstructorInterface['customItemHandle'];
};

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
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
        renderItem,
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
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return (
        <ItemWrapper
          tX={transform ? `${Math.round(transform.x)}px` : undefined}
          tY={transform ? `${Math.round(transform.y)}px` : undefined}
          sX={transform?.scaleX ? `${transform.scaleX}` : undefined}
          sY={transform?.scaleY ? `${transform.scaleY}` : undefined}
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
        </ItemWrapper>
      );
    },
  ),
);

const ItemWrapper = styled.div<{
  tX?: string;
  tY?: string;
  sX?: string;
  sY?: string;
}>`
  display: flex;
  box-sizing: border-box;
  transform: translate3d(${({ tX }) => tX}, ${({ tY }) => tY}, 0)
    scaleX(${({ sX }) => sX}) scaleY(${({ sY }) => sY});
  transform-origin: 0 0;
  touch-action: manipulation;
`;
