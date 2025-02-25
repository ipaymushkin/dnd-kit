import { Constructor } from './modules/constructor';
import { meta } from './config/meta.ts';
import { generateItems } from './modules/constructor/utils/generateItems.ts';
import { Fragment, useState } from 'react';
import { groupBy } from 'lodash';

const ConstructorModule = ({ config, items }: any) => {
  return (
    <Constructor
      meta={config}
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
      // onRemoveContainer={container => {
      //   console.log(container);
      // }}
    />
  );
};

const App = () => {
  const [config, setConfig] = useState<string>(
    JSON.stringify(meta, undefined, 4),
  );
  const [items, setItems] = useState<string>(
    JSON.stringify(
      generateItems({ meta: JSON.parse(config), count: 50 }),
      undefined,
      4,
    ),
  );

  const [ready, setReady] = useState<boolean>(false);

  if (ready) {
    const parsedConfig = JSON.parse(config);
    const parsedItems = JSON.parse(items);
    if (parsedConfig.groupByField) {
      const groups = groupBy(parsedItems, parsedConfig.groupByField);
      return (
        <>
          {Object.keys(groups).map(group => {
            const groupedItems = groups[group];
            return (
              <div key={`group_${group}`}>
                <div>Группа с ID {group}</div>
                <ConstructorModule config={parsedConfig} items={groupedItems} />
              </div>
            );
          })}
        </>
      );
    }
    return <ConstructorModule config={parsedConfig} items={parsedItems} />;
  }
  return (
    <div>
      <h4>Конфиг:</h4>
      <ul>
        <li>
          columnField - поле элемента по которому будут сгруппированы элементы в
          колонки (обязательное поле)
        </li>
        <li>itemUniqKey - уникальное поле элемента (обязательное поле)</li>
        <li>
          itemCardLabelKey - уникальное поле элемента (не обязательное поле при
          наличии renderItem)
        </li>
        <li>
          columns - колонки (обязательное поле), где:
          <ul>
            <li>label - название колонки</li>
            <li>value - значение из поля columnField</li>
            <li>
              isCollectively - флаг что поля является собирательным - чтобы
              выводить элементы которые не относятся ни к одной колонке (в этом
              случае поле value не обязательное)
            </li>
          </ul>
        </li>
      </ul>

      <textarea
        style={{ width: '100%', height: '200px' }}
        value={config}
        onChange={e => setConfig(e.target.value)}
      ></textarea>
      <h4>Элементы:</h4>
      <ul>
        <li>Уникальное поле (ключ который записан в itemUniqKey конфига)</li>
        <li>
          Поле для группировки по столбцам (которое записано в columnField
          конфига)
        </li>
      </ul>
      <textarea
        style={{ width: '100%', height: '200px' }}
        value={items}
        onChange={e => setItems(e.target.value)}
      ></textarea>
      <button
        onClick={() => {
          setItems(
            JSON.stringify(
              generateItems({ meta: JSON.parse(config), count: 50 }),
              undefined,
              4,
            ),
          );
        }}
      >
        Сгенерировать элементы
      </button>
      <br />
      <br />
      <br />
      <button onClick={() => setReady(true)}>Сгенерировать Agile Board</button>
    </div>
  );
};

export default App;
