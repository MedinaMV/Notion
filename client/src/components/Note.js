import Paragraph from "./Paragraph";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import url from '../api/api-calls.js';

export default function Note({ title, elements, noteId, setNoteSelected }) {

  async function newParagraph(event) {
    const flag = event.target.getAttribute('data');
    let Id = '';
    if (flag === 'paragraph') {
      const request = await fetch(url + `/notes/${noteId}/addParagraph`, { method: 'POST', headers: { 'Content-type': 'application/json' }, credentials: 'include' });
      const body = await request.json();
      Id = body._id;

      let newElements = elements;
      newElements.push({ type: flag, content: '', _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    } else if (flag === 'list') {
      const request = await fetch(url + `/notes/${noteId}/addList`, { method: 'POST', headers: { 'Content-type': 'application/json' }, credentials: 'include' });
      const body = await request.json();

      let newElements = elements;
      Id = body._id;
      newElements.push({ type: flag, items: [{ content: '' }], _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    } else {
      const request = await fetch(url + `/notes/${noteId}/addImage`, { method: 'POST', headers: { 'Content-type': 'application/json' }, credentials: 'include' });
      const body = await request.json();
      Id = body._id;
      let newElements = elements;
      newElements.push({ type: flag, content: '', _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    }
  }

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    elements = items;

    const request = await fetch(url + `/notes/${noteId}/moveNoteElements`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        sourceId: elements[result.source.index]._id, 
        sourceType: elements[result.source.index].type, 
        destinationId: elements[result.destination.index]._id,
        destinationType: elements[result.destination.index].type
      })
    });
    await request.json();

  };

  return (
    <div className='noteContent'>
      <p contentEditable> {title} </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='Elements'>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {elements ? elements.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                  {(provided) => (
                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                      <Paragraph
                        key={task._id}
                        text={task.content}
                        type={task.type}
                        noteId={noteId}
                        element_id={task._id}
                        elements={task} />
                        <br />
                    </div>
                  )}
                </Draggable>
              )) : <p>No elements</p>}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div>
        <button className='paragraphButton' onClick={newParagraph} data='paragraph'> New Paragraph </button>
        <button className='paragraphButton' onClick={newParagraph} data='image'> New Image </button>
        <button className='paragraphButton' onClick={newParagraph} data='list'> New List </button>
      </div>
    </div>
  );
}