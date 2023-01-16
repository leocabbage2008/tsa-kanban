import classNames from 'classnames';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import './assets/css/index.css';

const items = [
  { id: uuid(), content: 'hi 1' },
  { id: uuid(), content: 'hi 2' },
  { id: uuid(), content: 'hi 3' },
  { id: uuid(), content: 'hi 1' },
  { id: uuid(), content: 'hi 2' },
  { id: uuid(), content: 'hi 3' },
  { id: uuid(), content: 'hi 1' },
  { id: uuid(), content: 'hi 2' },
  { id: uuid(), content: 'hi 3' },
];


const columns = {
  [uuid()]: {
    name: 'todo',
    items: items,
  },
  [uuid()]: {
    name: 'in progress',
    items: [],
  },
  [uuid()]: {
    name: 'finish',
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copy = [...column.items];
    const [removed] = copy.splice(source.index, 1);
    copy.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: { ...column, items: copy },
    });
  }
};

export default function App() {
  const [c, setC] = useState(columns);
  return (
    <div className='content'>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, c, setC)}>
        {Object.entries(c).map(([id, column]) => {
          return (
            <div className='column' key={id}>
              <h2>{column.name}</h2>
              <div className='lane-container'>
                <Droppable droppableId={id} key={id} style={{ transform: "none!important" }}>
                  {(provided, snap) => (
                    <div
                      {...provided.droppableProps}
                      className='lane'
                      ref={provided.innerRef}
                      style={{
                        background: snap.isDraggingOver
                          ? 'lightblue'
                          : 'lightgrey',
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snap) => {
                              return (
                                <div
                                  className={classNames('card', {
                                    active: snap.isDragging,
                                  })}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <h1>
                                    {item.content}
                                  </h1>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      <div className={classNames("placeholder", { "over": snap.isDraggingOver })}>
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
