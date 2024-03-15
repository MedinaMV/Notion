import React from 'react';
import './App.css';

export default function App() {

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
  ];

  return (
    <div className="app">
      <LateralMenu noterows={NOTEROWS}/>
      <div className="note">
        <Note Title={"Tortilla de Patatas"} Elements={PARAGRAPHS} />
      </div>
    </div>
  );
}

function LateralMenu({ noterows }) {
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
        noteId={row.id}
        manageNoteRows={manageNoteRows}
        />
      ))}
      <div className="noteButtonContainer">
        <button onClick={handleClick} className="noteButton"> ➕ New Note </button>
      </div>
    </div>
  );
}

function NoteRow({ noteRow, noteId, manageNoteRows}) {

  function handleClick() {
    console.log(noteId);
  }

  function deleteNote() {
    if(window.confirm('Are you sure about deleting this note?')){
      fetch(`/notes/${noteId}/delete`, {
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

function Note({Title, Elements}) {
  const [elements, setParagraphs] = React.useState(Elements);

  function newParagraph(){
    setParagraphs([...elements, <Paragraph />]);
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
        elementId={element.id}/>
        <br/> 
      </>
    ))}
    <div>
      <button className='paragraphButton' onClick={newParagraph}> New Paragraph </button>
    </div>
  </div>
  );
}

function Paragraph({type, text, elementId}) {
  const [image, setImage] = React.useState(text);
  const [showImageInput, setShowImageInput] = React.useState(type === 'image' ? true : false);

  function handleChange(event) {
    if(event.target.value === '/image') {
      setShowImageInput(true);
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
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
        <textarea onChange={handleChange} placeholder='Your text goes here'>{text}</textarea>
      )}
    </div>
  );
}