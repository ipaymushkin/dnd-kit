import { Constructor } from './modules/constructor';
import { meta } from './config/meta.ts';
import { generateItems } from './modules/constructor/utils/generateItems.ts';
import { ItemsType } from './config/types.ts';

const App = () => {
  const items = generateItems({ meta, count: 50 }) as ItemsType[];
  return (
    <Constructor
      meta={meta}
      list={items}
      // customItemHandle={true}
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
        dragging,
        disabled,
        handleProps,
      }) => {
        return (
          <div>
            <div>{value.id}</div>
            {/*<div {...listeners} {...handleProps}>*/}
            {/*  drag*/}
            {/*</div>*/}
          </div>
        );
      }}
    />
  );
};

export default App;
