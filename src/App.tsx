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
      // renderItem={({
      //   value,
      //   transition,
      //   transform,
      //   ref,
      //   index,
      //   listeners,
      //   style,
      //   fadeIn,
      //   sorting,
      //   dragOverlay,
      //   dragging,
      //   disabled,
      //   handleProps,
      // }) => {
      //   return (
      //     <div>
      //       <div>{value.id}</div>
      //       {/*<div {...listeners} {...handleProps}>*/}
      //       {/*  drag*/}
      //       {/*</div>*/}
      //     </div>
      //   );
      // }}
      // renderContainer={({ containerMeta, handleProps, onRemove, children }) => {
      //   return (
      //     <div>
      //       <div>{containerMeta.label}</div>
      //       {/*<div {...handleProps}>drag</div>*/}
      //       <div>{children}</div>
      //     </div>
      //   );
      // }}
      onRemoveContainer={container => {
        console.log(container);
      }}
    />
  );
};

export default App;
