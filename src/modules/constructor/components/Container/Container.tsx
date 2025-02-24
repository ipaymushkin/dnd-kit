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
  onRemoveContainer: ConstructorInterface['onRemoveContainer'];
  hideColumnSorting: ConstructorInterface['hideColumnSorting'];
  hideColumnRemove: ConstructorInterface['hideColumnRemove'];
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
      onRemoveContainer,
      hideColumnSorting,
      hideColumnRemove,
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
                {!hideColumnRemove && (
                  <div
                    onClick={() => {
                      onRemoveContainer?.(containerMeta);
                      onRemove?.();
                    }}
                  >
                    <Remove />
                  </div>
                )}
                {!hideColumnSorting && (
                  <div {...handleProps}>
                    <Handle />
                  </div>
                )}
              </div>
            </div>
            <div style={{ minHeight: '400px' }}>{children}</div>
          </>
        )}
      </Component>
    );
  },
);
