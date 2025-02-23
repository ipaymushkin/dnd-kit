import { Constructor } from './modules/constructor';
import { meta } from './config/meta.ts';
import { generateItems } from './modules/constructor/utils/generateItems.ts';
import { ItemsType } from './config/types.ts';
import React from 'react';
import styles from './modules/constructor/components/Item/Item.module.css';
import classNames from 'classnames';

const App = () => {
  const items = generateItems({ meta, count: 50 }) as ItemsType[];
  return (
    <Constructor
      meta={meta}
      list={items}
      renderItem={({
        value,
        transition,
        transform,
        ref,
        index,
        listeners,
        style,
        fadeIn,
        sorting,
        dragOverlay,
      }) => {
        return (
          <li
            ref={ref}
            data-cypress="draggable-item"
            className={classNames(
              styles.Wrapper,
              // fadeIn && styles.fadeIn,
              // sorting && styles.sorting,
              // dragOverlay && styles.dragOverlay,
            )}
            style={
              {
                ...style,
                transition: [transition].filter(Boolean).join(', '),
                '--translate-x': transform
                  ? `${Math.round(transform.x)}px`
                  : undefined,
                '--translate-y': transform
                  ? `${Math.round(transform.y)}px`
                  : undefined,
                '--scale-x': transform?.scaleX
                  ? `${transform.scaleX}`
                  : undefined,
                '--scale-y': transform?.scaleY
                  ? `${transform.scaleY}`
                  : undefined,
                '--index': index,
              } as React.CSSProperties
            }
            {...listeners}
          >
            {value.id}
          </li>
        );
      }}
    />
  );
};

export default App;
