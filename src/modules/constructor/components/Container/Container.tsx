import React, { forwardRef, memo, useContext } from 'react';
import { Remove } from '../../icons/Remove.tsx';
import Handle from '../../icons/Handle.tsx';
import {
  ConfigColumnInterface,
  ConstructorInterface,
} from '../../../../config/types.ts';
import { ConstructorContext } from '../../context.tsx';

export type Props = {
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
  handleProps?: React.HTMLAttributes<any>;
  onClick?: () => void;
  onRemove?: () => void;
} & {
  containerMeta: ConfigColumnInterface;
  onRemoveContainer: ConstructorInterface['onRemoveContainer'];
};

export const Container = memo(
  forwardRef<HTMLDivElement, Props>(
    (
      {
        children,
        handleProps,
        onClick,
        onRemove,
        label,
        style,
        containerMeta,
        onRemoveContainer,
        ...props
      }: Props,
      ref,
    ) => {
      const { renderContainer, hideColumnRemove, hideColumnSorting } =
        useContext(ConstructorContext);

      return (
        <div
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
        </div>
      );
    },
  ),
);
