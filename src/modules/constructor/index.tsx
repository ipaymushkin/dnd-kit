import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal, unstable_batchedUpdates } from 'react-dom';
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
  ConfigInterface,
  ConstructorInterface,
  Items,
} from '../../config/types.ts';
import styled from 'styled-components';

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
  cancelDrop,
  handle = false,
  containerStyle,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  modifiers,
  renderItem,
  scrollable,
  meta,
  list,
}: ConstructorInterface & { meta: ConfigInterface; list: Items[] }) => {
  const groupedList = useMemo(() => {
    return groupBy(list, meta.columnField);
  }, [list, meta.columnField]);

  const [items, setItems] = useState<{ [key: string]: Items[] }>(
    meta.columns.reduce((previousValue, currentValue) => {
      return Object.assign(previousValue, {
        [`${currentValue.value ?? otherColumnsValue}`]:
          groupedList[currentValue.value ?? otherColumnsValue],
      });
    }, {}),
  );

  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[],
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer =
    activeId != null ? containers.includes(activeId) : false;

  const { collisionDetectionStrategy } = useCollisionDetectionStrategy({
    activeId,
    lastOverId,
    recentlyMovedToNewContainer,
    items,
  });

  const [clonedItems, setClonedItems] = useState<Items | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: multipleContainersCoordinateGetter,
    }),
  );

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find(key =>
      items[key].find(el => el[meta.itemUniqKey] === id),
    );
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    return items[container].indexOf(id);
  };

  const onDragCancel = () => {
    if (clonedItems) {
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  const onDragStart = ({ active }: any) => {
    setActiveId(active.id);
    setClonedItems(items);
  };

  const onDragOver = ({ active, over }: any) => {
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

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
  };

  const onDragEnd = ({ active, over }: any) => {
    if (active.id in items && over?.id) {
      setContainers(containers => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);

        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    console.log(overContainer, activeContainer);

    if (overContainer) {
      const activeIndex = items[activeContainer].findIndex(
        el => el[meta.itemUniqKey] === active.id,
      );
      const overIndex = items[overContainer].findIndex(
        el => el[meta.itemUniqKey] === overId,
      );

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

    setActiveId(null);
  };

  const renderSortableItemDragOverlay = (id: UniqueIdentifier) => {
    return (
      <Item
        value={id}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    );
  };

  const renderContainerDragOverlay = (containerId: UniqueIdentifier) => {
    return (
      <Container
        label={`Column ${containerId}`}
        style={{
          height: '100%',
        }}
        shadow
      >
        {items[containerId].map((item, index) => {
          return (
            <Item
              key={item[meta.itemUniqKey]}
              value={item[meta.itemUniqKey]}
              handle={handle}
              style={getItemStyles({
                containerId,
                overIndex: -1,
                index: getIndex(item[meta.itemUniqKey]),
                value: item,
                isDragging: false,
                isSorting: false,
                isDragOverlay: false,
              })}
              wrapperStyle={wrapperStyle({ index })}
              renderItem={renderItem}
            />
          );
        })}
      </Container>
    );
  };

  const handleRemove = (containerID: UniqueIdentifier) => {
    setContainers(containers => containers.filter(id => id !== containerID));
  };

  const getNextContainerId = () => {
    const containerIds = Object.keys(items);
    const lastContainerId = containerIds[containerIds.length - 1];

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <Wrapper columns={meta.columns.length}>
        <SortableContext
          items={containers}
          strategy={horizontalListSortingStrategy}
        >
          {containers.map(containerId => {
            const containerMeta =
              containerId === otherColumnsValue
                ? meta.columns.find(el => el.isCollectively)
                : meta.columns.find(el => el.value === containerId);

            const contextItems = items[containerId].map(el => ({
              id: el[meta.itemUniqKey],
            })) as any[];

            return (
              <DroppableContainer
                key={containerId}
                id={containerId}
                label={containerMeta?.label}
                items={items[containerId]}
                scrollable={scrollable}
                style={containerStyle}
                onRemove={() => handleRemove(containerId)}
              >
                <SortableContext
                  items={contextItems}
                  strategy={verticalListSortingStrategy}
                >
                  {items[containerId].map((value, index) => {
                    return (
                      <SortableItem
                        key={value[meta.itemUniqKey]}
                        id={value[meta.itemUniqKey]}
                        disabled={isSortingContainer}
                        index={index}
                        handle={handle}
                        style={getItemStyles}
                        wrapperStyle={wrapperStyle}
                        renderItem={renderItem}
                        containerId={containerId}
                        getIndex={getIndex}
                      />
                    );
                  })}
                </SortableContext>
              </DroppableContainer>
            );
          })}
        </SortableContext>
      </Wrapper>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

const Wrapper = styled.div<{ columns: number }>`
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
`;
