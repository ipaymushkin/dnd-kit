import React, { forwardRef } from 'react';
import { Remove } from '../../icons/Remove.tsx';
import Handle from '../../icons/Handle.tsx';

export interface Props {
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
  handleProps?: React.HTMLAttributes<any>;
  shadow?: boolean;
  placeholder?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      handleProps,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      ...props
    }: Props,
    ref,
  ) => {
    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        style={style}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div>
            {label}
            <div>
              <div onClick={onRemove}>
                <Remove />
              </div>
              <div {...handleProps}>
                <Handle />
              </div>
            </div>
          </div>
        ) : null}
        {placeholder ? children : <div>{children}</div>}
      </Component>
    );
  },
);
