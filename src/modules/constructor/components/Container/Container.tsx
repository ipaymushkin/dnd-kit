import React, { forwardRef, memo, useContext } from 'react';
import { ConfigColumnInterface } from '../../config/types.ts';
import { ConstructorContext } from '../../context.tsx';

export type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  handleProps?: React.HTMLAttributes<any>;
  onClick?: () => void;
  onRemove?: () => void;
  hover?: boolean;
} & {
  containerMeta: ConfigColumnInterface;
};

export const Container = memo(
  forwardRef<HTMLDivElement, Props>(
    (
      {
        children,
        handleProps,
        onClick,
        onRemove,
        style,
        containerMeta,
        hover,
        ...props
      }: Props,
      ref,
    ) => {
      const { renderContainer } = useContext(ConstructorContext);

      return (
        <div
          {...props}
          ref={ref}
          style={style}
          onClick={onClick}
          tabIndex={onClick ? 0 : undefined}
        >
          {renderContainer({
            containerMeta,
            handleProps,
            onRemove,
            children,
            hover,
          })}
        </div>
      );
    },
  ),
);
