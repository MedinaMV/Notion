import React from 'react';
import './App.css';

export default function App() {

  const [noteSelected, setNoteSelected] = React.useState(null);

  function renderNote (title, paragraphs) {
    setNoteSelected(<div className="note"><Note Title={/*title*/"Tortilla de Patatas"} Elements={/*paragraphs*/PARAGRAPHS} /></div>);
  }

  /*const noterows = async () => {
    await fetch('/notes/getAll').json();
  } */

  const NOTEROWS = [
    { title: 'Tortilla de Patatas', id: 1 },
    { title: 'Lomo con Pimientos', id: 2 },
    { title: 'Pulpo a la Gallega', id: 3 },
    { title: 'Cocido Madrileño', id: 4 }
  ];

  const PARAGRAPHS = [
    { type: 'paragraph', text: 'Patatas 700 g', id: 1 },
    { type: 'paragraph', text: 'Cebolla 300 g', id: 2 },
    { type: 'paragraph', text: 'Huevos 6 ', id: 3 },
    { type: 'paragraph', text: 'Sal', id: 4 },
    { type: 'image', text: 'https://i.imgur.com/yXOvdOSs.jpg', id: 5 },
    { type: 'list', text: ['Elemento de ejemplo 1', 'Elemento de ejemplo2', 'Elemento de ejemplo 3'], id: 6 }
  ];

  return (
    <div className="app">
      <LateralMenu noterows={NOTEROWS} renderNote={renderNote}/>
      <div className="note">
        {noteSelected}
      </div>
    </div>
  );
}

function LateralMenu({ noterows, renderNote }) {
  const [rows, setRows] = React.useState(noterows);
  
  async function handleClick() {
    var input = prompt('Set a title for your new Note');
    
    fetch('/notes/create' , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({title: input}) 
    }).then(response => response.json())
      .then(data => {
        var newRow = {title: input, id: data.id};
        manageNoteRows(newRow);
      })
  }

  function manageNoteRows(newRow){
    newRow ? setRows([...rows, newRow ]) : setRows(rows.slice(0, -1));
  }

  return (
    <div className="lateral">
      <div style={{ textAlign: 'center'}}>
        <h2> My Notes </h2>
      </div>
      {rows.map(row => (
        <NoteRow 
        noteRow={row}
        key={row.id}
        manageNoteRows={manageNoteRows}
        renderNote={renderNote}
        />
      ))}
      <div className="noteButtonContainer">
        <button onClick={handleClick} className="noteButton"> ➕ New Note </button>
      </div>
    </div>
  );
}

function NoteRow({ noteRow, manageNoteRows, renderNote}) {

  async function handleClick() {
    console.log(noteRow.id);
    //const data = (await fetch(`/notes/${noteRow.id}/getNote`)).json();
    renderNote(/*noteRow.title,data*/);
  }

  function deleteNote() {
    if(window.confirm('Are you sure about deleting this note?')){
      fetch(`/notes/${noteRow.id}/delete`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' }
      }).then(response => response.json())
        .then(data => console.log(data))
    }
    manageNoteRows(null);
  }

  return (
    <div onClick={handleClick} className="noteRow">
      <p className="noteRowTitle"> { noteRow.title } </p>
      <button className='noteRowButton'> 🔗 </button>
      <button onClick={deleteNote} className='noteRowButton'> ❌ </button>
    </div>
  );
}

function Note({Title, Elements, noteId}) {
  const [elements, setParagraphs] = React.useState(Elements);

  function newParagraph(event){
    const flag = event.target.getAttribute('data');
    if (flag === 'paragraph'){
      fetch(`/note/${noteId}/addParagraph`, {
        method: 'POST',
        headers: { 'Content-type' : 'application/json' } 
      }).then(response => response.json())
        .then(data => console.log(data));
    }
    setParagraphs([...elements, { type: flag, text: '', id: 99 }]);
  }

  return (
  <div className='noteContent'>
    <p contentEditable> {Title} </p>
    {elements.map(element => (
      <>
        <Paragraph 
        key={element.id}
        text={element.text}
        type={element.type}
        noteId={noteId}
        elements={Elements}/>
        <br/> 
      </>
    ))}
    <div>
      <button className='paragraphButton' onClick={newParagraph} data='paragraph'> New Paragraph </button>
      <button className='paragraphButton' onClick={newParagraph} data='image'> New Image </button>
      <button className='paragraphButton' onClick={newParagraph} data='list'> New List </button>
    </div>
  </div>
  );
}

function Paragraph({type, text, noteId, elements}) {
  const [image, setImage] = React.useState(text);
  const showImageInput = (type === 'image' ? true : false);
  const isListElement = (type === 'list' ? true : false);

  const handleImageChange = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append('image', file);
    if (file) {
      const request = await fetch(`/notes/65f5d28bb169d2c233bddecd/addImage`, {
        method: 'POST',
        body: formData
      });
      const response = await request.json();
      setImage(response.url);
    }
  };

  return(
    <div className='paragraphStyle'>
      {showImageInput ? (
        image ? (
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )
      ) : (
        isListElement ? (
          <ListElement elements={elements} noteId={noteId}/>
        ) : (
          <textarea placeholder='Your text goes here'>{text}</textarea>
        )
      )}
    </div>
  );
}

function ListElement({elements, noteId}) {

  const items = elements.find(element => element.type === 'list');

  let listItems = [];
  items.text.forEach(item => {
    listItems.push(<li>{item}</li>);
  });

  const [list, setList] = React.useState(listItems);
  const [item, setItem] = React.useState(null);

  const addElement = async () => {
    const formData = new FormData();
    formData.append('element', item);
    //const request = await fetch(`/notes/${noteId}/${listId}/addListElement`);
    const request = await fetch(`/notes/65f5d28bb169d2c233bddecd/65f6eddd16f3dfdd3679c084/addListElement`, {
      method: 'POST', body: formData
    });
    const response = await request.json();
    setList([...list, <li key={response.id}>{item}</li>]);
  }

  return(
    <div>
      <div>
        <input type='text' onChange={(e) => setItem(e.target.value)} placeholder='Add your task'></input>
        <button onClick={addElement}> Add </button>
      </div>
      <ul>{ list }</ul>
    </div>
  );
}