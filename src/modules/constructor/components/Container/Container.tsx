import React, { forwardRef } from 'react';
import { Remove } from '../../icons/Remove.tsx';
import Handle from '../../icons/Handle.tsx';
import {
  ConfigColumnInterface,
  ConstructorInterface,
} from '../../../../config/types.ts';

export type Props = {
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
  handleProps?: React.HTMLAttributes<any>;
  onClick?: () => void;
  onRemove?: () => void;
} & {
  renderContainer?: ConstructorInterface['renderContainer'];
  containerMeta: ConfigColumnInterface;
};

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      handleProps,
      onClick,
      onRemove,
      label,
      style,
      renderContainer,
      containerMeta,
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
        {renderContainer ? (
          renderContainer({ containerMeta, handleProps, onRemove, children })
        ) : (
          <>
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
            <div style={{ minHeight: '400px' }}>{children}</div>
          </>
        )}
      </Component>
    );
  },
);
