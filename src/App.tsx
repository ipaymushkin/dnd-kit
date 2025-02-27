import { Constructor } from './modules/constructor';
import { meta } from './modules/constructor/config/meta.ts';
import { generateItems } from './modules/constructor/utils/generateItems.ts';
import { useCallback, useState } from 'react';
import { groupBy } from 'lodash';
import './style.css';
import {
  ConfigColumnInterface,
  ConfigInterface,
  ItemType,
  onElementDragEndInterface,
  renderContainerInterface,
  renderItemInterface,
} from './modules/constructor/config/types.ts';

const hexToRGB = (hex: string, alpha?: number) => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
};

const AddIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.80013 13.1667C8.45495 13.1667 8.17513 12.8869 8.17513 12.5417V9.62508H5.25846C4.91329 9.62508 4.63346 9.34526 4.63346 9.00008C4.63346 8.6549 4.91329 8.37508 5.25846 8.37508H8.17513V5.45842C8.17513 5.11324 8.45495 4.83342 8.80013 4.83342C9.14531 4.83342 9.42513 5.11324 9.42513 5.45842V8.37508H12.3418C12.687 8.37508 12.9668 8.6549 12.9668 9.00008C12.9668 9.34526 12.687 9.62508 12.3418 9.62508H9.42513V12.5417C9.42513 12.8869 9.14531 13.1667 8.80013 13.1667Z"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.1335 9.00008C17.1335 13.6025 13.4025 17.3334 8.80013 17.3334C4.19776 17.3334 0.466797 13.6025 0.466797 9.00008C0.466797 4.39771 4.19776 0.666748 8.80013 0.666748C13.4025 0.666748 17.1335 4.39771 17.1335 9.00008ZM15.8835 9.00008C15.8835 12.9121 12.7121 16.0834 8.80013 16.0834C4.88811 16.0834 1.7168 12.9121 1.7168 9.00008C1.7168 5.08806 4.88811 1.91675 8.80013 1.91675C12.7121 1.91675 15.8835 5.08806 15.8835 9.00008Z"
        fill="white"
        fillOpacity="0.3"
      />
    </svg>
  );
};

const MoreIcon = () => {
  return (
    <svg
      width="16"
      height="4"
      viewBox="0 0 16 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.63363 1.99992C3.63363 2.92039 2.88743 3.66659 1.96696 3.66659C1.04649 3.66659 0.300293 2.92039 0.300293 1.99992C0.300293 1.07944 1.04649 0.333252 1.96696 0.333252C2.88743 0.333252 3.63363 1.07944 3.63363 1.99992Z"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M9.46696 1.99992C9.46696 2.92039 8.72077 3.66659 7.80029 3.66659C6.87982 3.66659 6.13363 2.92039 6.13363 1.99992C6.13363 1.07944 6.87982 0.333252 7.80029 0.333252C8.72077 0.333252 9.46696 1.07944 9.46696 1.99992Z"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M13.6336 3.66659C14.5541 3.66659 15.3003 2.92039 15.3003 1.99992C15.3003 1.07944 14.5541 0.333252 13.6336 0.333252C12.7132 0.333252 11.967 1.07944 11.967 1.99992C11.967 2.92039 12.7132 3.66659 13.6336 3.66659Z"
        fill="white"
        fillOpacity="0.3"
      />
    </svg>
  );
};

const HandleIcon = () => {
  return (
    <svg viewBox="0 0 20 20" width="12">
      <path
        d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
        fill="white"
        fillOpacity="0.3"
      ></path>
    </svg>
  );
};

const Status1 = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" rx="3" fill="#30D158" fillOpacity="0.16" />
      <path
        d="M10.0002 9.22211L6.3835 6.6336C6.16127 6.47773 5.93072 6.45825 5.69183 6.57515C5.45294 6.69205 5.3335 6.88967 5.3335 7.168C5.3335 7.39067 5.43905 7.60777 5.61683 7.7191L10.0002 10.8587L14.3835 7.7191C14.5613 7.60777 14.6668 7.39067 14.6668 7.168C14.6668 6.9008 14.5474 6.70597 14.3085 6.5835C14.0696 6.46103 13.8391 6.47773 13.6168 6.6336L10.0002 9.22211ZM10.0002 12.5301L6.3835 9.94155C6.16127 9.78568 5.93072 9.7662 5.69183 9.8831C5.45294 10 5.3335 10.1976 5.3335 10.476C5.3335 10.6986 5.43905 10.9157 5.61683 11.0271L10.0002 14.1667L14.3835 11.0271C14.5613 10.9157 14.6668 10.6986 14.6668 10.476C14.6668 10.2088 14.5474 10.0139 14.3085 9.89145C14.0696 9.76898 13.8391 9.78568 13.6168 9.94155L10.0002 12.5301Z"
        fill="#30D158"
      />
    </svg>
  );
};

const Status2 = () => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.200195"
        width="20"
        height="20"
        rx="3"
        fill="#6385C7"
        fillOpacity="0.16"
      />
      <path
        d="M6.20036 9.00008C5.82872 9.00008 5.53369 8.70505 5.53369 8.33341C5.53369 7.96178 5.82872 7.66675 6.20036 7.66675H14.2004C14.572 7.66675 14.867 7.96178 14.867 8.33341C14.867 8.70505 14.572 9.00008 14.2004 9.00008H6.20036ZM6.20036 12.3334C5.82872 12.3334 5.53369 12.0384 5.53369 11.6667C5.53369 11.2951 5.82872 11.0001 6.20036 11.0001H14.2004C14.572 11.0001 14.867 11.2951 14.867 11.6667C14.867 12.0384 14.572 12.3334 14.2004 12.3334H6.20036Z"
        fill="#6385C7"
      />
    </svg>
  );
};

const descriptions = [
  'Разработать дизайн карточки раздела Задачи. Продумать варианты.',
  'Разработать дизайн карточки раздела Задачи.',
  'Разработать дизайн',
];

const TypeStr = ({ variant }: { variant: number }) => {
  let label: string, color: string;
  if (variant === 0) {
    label = 'Разработка';
    color = '#D154A7';
  } else if (variant === 1) {
    label = 'Документация';
    color = '#40C8E0';
  } else {
    label = 'Дизайн';
    color = '#5E5CE6';
  }
  return <div style={{ fontSize: '12px', color }}>{label}</div>;
};

const ConstructorModule = ({
  config,
  items,
}: {
  config: ConfigInterface;
  items: ItemType[];
}) => {
  const renderItem = useCallback(
    ({
      value,
      // transition,
      // transform,
      // ref,
      // index,
      // listeners,
      // fadeIn,
      // sorting,
      // dragOverlay,
      dragging,
      // disabled,
      // handleProps,
    }: renderItemInterface) => {
      const styleObj = {
        background: '#1B1E21',
        padding: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        width: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '10px',
      } as React.CSSProperties;

      if (dragging) {
        styleObj['opacity'] = `0.5`;
      }

      return (
        <div style={styleObj}>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            {[<Status1 />, <Status2 />][value.id % 2]}
            <div>CubeKit-{value.id}</div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {descriptions[value.id % descriptions.length]}
          </div>
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.25)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '8px',
                background: ['#D154A7', '#5E5CE6', '#AC8E68'][value.id % 3],
              }}
            >
              {['АВ', 'ВП', 'ИШ', 'ЛП'][value.id % 4]}
            </div>
            <TypeStr variant={value.id % 3} />
          </div>
          {/*<div {...listeners} {...handleProps}>*/}
          {/*  drag*/}
          {/*</div>*/}
        </div>
      );
    },
    [],
  );

  const renderContainer = useCallback(
    ({
      containerMeta,
      handleProps,
      // onRemove,
      children,
    }: renderContainerInterface) => {
      return (
        <div>
          <div
            style={{
              background: '#1B1E21',
              padding: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                padding: '5px',
                color: containerMeta.color,
                background: hexToRGB(containerMeta.color, 0.15),
                width: 'auto',
                display: 'inline-block',
              }}
            >
              {containerMeta.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '25px',
                  height: '25px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AddIcon />
              </div>
              <div
                style={{
                  width: '25px',
                  height: '25px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MoreIcon />
              </div>
              <div
                style={{
                  width: '25px',
                  height: '25px',
                  cursor: 'grab',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                {...handleProps}
              >
                <HandleIcon />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      );
    },
    [],
  );

  const onContainerDragEnd = useCallback((container: ConfigColumnInterface) => {
    console.log('onContainerDragEnd', container);
  }, []);

  const onElementDragEnd = useCallback(
    ({ container, element, oldIndex, newIndex }: onElementDragEndInterface) => {
      console.log(container, element, oldIndex, newIndex);
    },
    [],
  );

  return (
    <Constructor
      meta={config}
      list={items}
      renderItem={renderItem}
      renderContainer={renderContainer}
      onContainerDragEnd={onContainerDragEnd}
      onElementDragEnd={onElementDragEnd}
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

  const [ready, setReady] = useState<boolean>(true);

  if (ready) {
    const parsedConfig = JSON.parse(config);
    const parsedItems = JSON.parse(items);
    if (parsedConfig.groupByField) {
      const groups = groupBy(parsedItems, parsedConfig.groupByField);
      return (
        <>
          {Object.keys(groups).map(group => {
            const groupedItems = groups[group] as ItemType[];
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
        <li>
          groupByField - поле для группировки по разным Agile Boards
          (необязательное поле)
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
