import Paragraph from "./Paragraph";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Note({ title, elements, noteId, setNoteSelected }) {

  async function newParagraph(event) {
    const flag = event.target.getAttribute('data');
    let Id = '';
    if (flag === 'paragraph') {
      const request = await fetch(`/notes/${noteId}/addParagraph`, { method: 'POST', headers: { 'Content-type': 'application/json' } });
      const body = await request.json();
      Id = body._id;

      let newElements = elements;
      newElements.push({ type: flag, content: '', _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    } else if (flag === 'list') {
      const request = await fetch(`/notes/${noteId}/addList`, { method: 'POST', headers: { 'Content-type': 'application/json' } });
      const body = await request.json();

      let newElements = elements;
      Id = body._id;
      newElements.push({ type: flag, items: [{ content: '' }], _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    } else {
      const request = await fetch(`/notes/${noteId}/addImage`, { method: 'POST', headers: { 'Content-type': 'application/json' } });
      const body = await request.json();
      Id = body._id;
      let newElements = elements;
      newElements.push({ type: flag, content: '', _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    }
  }

  return (
    <div className='noteContent'>
      <p contentEditable> {title} </p>
      <DragDropContext>
        <Droppable droppableId="nice">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {elements ? elements.map((element, index) => {
                return (
                  <Draggable draggableId={element._id} index={index}>
                    {(provided) => (
                      <div {...provided.droppableProps} {...provided.dragHandleProps} ref={provided.innerRef} >
                        <Paragraph
                          key={element._id}
                          text={element.content}
                          type={element.type}
                          noteId={noteId}
                          element_id={element._id}
                          elements={element} />
                        <br />
                      </div>
                    )}
                  </Draggable>)
              }) : <p>No elements</p>}
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