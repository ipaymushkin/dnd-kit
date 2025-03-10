import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { coordinateGetter as multipleContainersCoordinateGetter } from './utils/coordinateGetter.ts';
import { groupBy } from 'lodash';

import { Item } from './components/Item';
import { Container } from './components/Container';

import { useCollisionDetectionStrategy } from './hooks/useCollisionDetectionStrategy.ts';
import { otherColumnsValue } from './const.ts';
import { DroppableContainer } from './components/DroppableContainer';
import { SortableItem } from './components/SortableItem';
import {
  AnyType,
  ConfigColumnInterface,
  ConfigInterface,
  ConstructorInterface,
  DndElementInterface,
  ItemsType,
  ItemType,
} from './config/types.ts';
import { ConstructorContext } from './context.tsx';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export const Constructor = ({
  customItemHandle = false,
  renderItem,
  renderContainer,
  meta,
  list,
  onContainerDragEnd,
  onElementDragEnd,
}: ConstructorInterface & { meta: ConfigInterface; list: ItemsType[] }) => {
  const groupedList = useMemo(() => {
    return groupBy(list, meta.columnField);
  }, [list, meta.columnField]);

  const [items, setItems] = useState<{ [key: string]: ItemType[] }>(
    meta.columns.reduce((previousValue, currentValue) => {
      return Object.assign(previousValue, {
        [`${currentValue.value ?? otherColumnsValue}`]:
          groupedList[currentValue.value ?? otherColumnsValue] || [],
      });
    }, {}),
  );

  const [containers, setContainers] = useState(
    Object.keys(items) as (string | number)[],
  );
  const [activeEl, setActiveEl] = useState<DndElementInterface | null>();
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeEl
    ? containers.includes(activeEl.id)
    : false;

  const { collisionDetectionStrategy } = useCollisionDetectionStrategy({
    activeId: activeEl?.id || null,
    lastOverId,
    recentlyMovedToNewContainer,
    items,
  });

  const [clonedItems, setClonedItems] = useState<{
    [key: string]: ItemType[];
  } | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: multipleContainersCoordinateGetter,
    }),
  );

  const getContainerMetaByContainerId = useCallback(
    (containerId: string) => {
      return containerId === otherColumnsValue
        ? meta.columns.find(el => el.isCollectively)
        : (meta.columns.find(
            el => el.value === containerId,
          ) as ConfigColumnInterface);
    },
    [meta.columns],
  );

  const findContainer = useCallback(
    (id: string) => {
      if (id in items) {
        return id as string;
      }

      return Object.keys(items).find(
        key => !!items[key].find(el => (el[meta.itemUniqKey] as string) === id),
      ) as string;
    },
    [items, meta.itemUniqKey],
  );

  const onDragCancel = useCallback(() => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveEl(null);
    setClonedItems(null);
  }, [clonedItems]);

  const onDragStart = useCallback(
    ({ active }: { active: DndElementInterface }) => {
      setActiveEl(active);
      setClonedItems(items);
    },
    [items],
  );

  const onDragOver = useCallback(
    ({
      active,
      over,
    }: {
      active: DndElementInterface;
      over: DndElementInterface;
    }) => {
      const overId = over?.id;

      if (overId == null || active.id in items) {
        return;
      }

      const overContainer = findContainer(overId as string);
      const activeContainer = findContainer(active.id as string);

      if (!overContainer || !activeContainer) {
        return;
      }

      if (activeContainer !== overContainer) {
        setItems(items => {
          const activeItems = items[activeContainer];
          const overItems = items[overContainer];
          const overIndex = overItems.findIndex(
            el => el[meta.itemUniqKey] === overId,
          );
          const activeIndex = activeItems.findIndex(
            el => el[meta.itemUniqKey] === active.id,
          );

          let newIndex: number;

          if (overId in items) {
            newIndex = overItems.length + 1;
          } else {
            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;

            newIndex =
              overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }

          recentlyMovedToNewContainer.current = true;

          return {
            ...items,
            [activeContainer]: items[activeContainer].filter(
              item => item[meta.itemUniqKey] !== active.id,
            ),
            [overContainer]: [
              ...items[overContainer].slice(0, newIndex),
              items[activeContainer][activeIndex],
              ...items[overContainer].slice(
                newIndex,
                items[overContainer].length,
              ),
            ],
          };
        });
      }
    },
    [findContainer, items, meta.itemUniqKey],
  );

  const onDragEnd = useCallback(
    ({
      active,
      over,
    }: {
      active: DndElementInterface;
      over: DndElementInterface;
    }) => {
      if (active.id in items && over?.id) {
        setContainers(containers => {
          const activeIndex = containers.indexOf(active.id);
          const overIndex = containers.indexOf(over.id);

          return arrayMove(containers, activeIndex, overIndex);
        });
        onContainerDragEnd?.(
          getContainerMetaByContainerId(findContainer(active.id as string)),
        );
      }

      const activeContainer = findContainer(active.id as string);

      if (!activeContainer) {
        setActiveEl(null);
        return;
      }

      const overId = over?.id;

      if (overId == null) {
        setActiveEl(null);
        return;
      }

      const overContainer = findContainer(overId as string);

      if (overContainer) {
        const element = items[activeContainer].find(
          el => el[meta.itemUniqKey] === active.id,
        );
        const activeIndex = items[activeContainer].findIndex(
          el => el[meta.itemUniqKey] === active.id,
        );
        const overIndex = items[overContainer].findIndex(
          el => el[meta.itemUniqKey] === overId,
        );

        onElementDragEnd?.({
          container: getContainerMetaByContainerId(
            findContainer(overContainer),
          ),
          oldIndex: activeIndex,
          newIndex: overIndex,
          element,
        });

        if (activeIndex !== overIndex) {
          setItems(items => ({
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex,
            ),
          }));
        }
      }

      setActiveEl(null);
    },
    [findContainer, items, meta.itemUniqKey],
  );

  const renderSortableItemDragOverlay = useCallback(
    (item: ItemType) => {
      const containerMeta = getContainerMetaByContainerId(
        findContainer(item.id),
      ) as ConfigColumnInterface;
      return <Item value={item} container={containerMeta} dragOverlay />;
    },
    [findContainer, getContainerMetaByContainerId],
  );

  const renderContainerDragOverlay = useCallback(
    (container: DndElementInterface) => {
      const containerMeta = getContainerMetaByContainerId(
        container.id as string,
      );
      if (!containerMeta) return null;
      return (
        <Container containerMeta={containerMeta}>
          {items[container.id].map(item => {
            return (
              <Item
                key={`overlay_${item[meta.itemUniqKey]}`}
                value={item}
                container={containerMeta}
              />
            );
          })}
        </Container>
      );
    },
    [getContainerMetaByContainerId, items, meta.itemUniqKey],
  );

  const handleRemove = useCallback((containerID: UniqueIdentifier) => {
    setContainers(containers => containers.filter(id => id !== containerID));
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <ConstructorContext.Provider
      value={{
        renderItem,
        renderContainer,
        customItemHandle,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={onDragStart}
        onDragOver={onDragOver as AnyType}
        onDragEnd={onDragEnd as AnyType}
        onDragCancel={onDragCancel}
      >
        <div
          style={{
            display: 'grid',
            columnGap: '10px',
            gridTemplateColumns: `repeat(${meta.columns.length}, 1fr)`,
          }}
        >
          <SortableContext
            items={containers}
            strategy={horizontalListSortingStrategy}
          >
            {containers.map(containerId => {
              const containerMeta = getContainerMetaByContainerId(
                containerId as string,
              );

              if (!containerMeta) {
                return <div>Проблема с колонкой {containerId}</div>;
              }

              const contextItems = items[containerId].map(el => ({
                id: el[meta.itemUniqKey],
              })) as { id: string }[];

              return (
                <DroppableContainer
                  containerMeta={containerMeta}
                  key={`droppable_${containerId}`}
                  id={containerId as string}
                  items={items[containerId]}
                  onRemove={() => handleRemove(containerId)}
                >
                  <SortableContext
                    items={contextItems}
                    strategy={verticalListSortingStrategy}
                  >
                    {items[containerId].map((value, index) => {
                      return (
                        <SortableItem
                          key={`sortable_${value[meta.itemUniqKey]}`}
                          id={value[meta.itemUniqKey]}
                          disabled={isSortingContainer}
                          index={index}
                          item={value}
                          containerMeta={containerMeta}
                        />
                      );
                    })}
                  </SortableContext>
                </DroppableContainer>
              );
            })}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeEl
              ? containers.includes(activeEl.id)
                ? renderContainerDragOverlay(activeEl)
                : renderSortableItemDragOverlay(activeEl)
              : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </ConstructorContext.Provider>
  );
};
