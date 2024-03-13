import { useState } from 'react';
import './App.css';

export default function App() {

  const NOTEROWS = [
    { title: 'Tortilla de Patatas', id: 1 },
    { title: 'Lomo con Pimientos', id: 2 },
    { title: 'Pulpo a la Gallega', id: 3 },
    { title: 'Cocido Madrileño', id: 4 }
  ];

  const PARAGRAPHS = [
    { text: 'Patatas 700 g', id: 1 },
    { text: 'Cebolla 300 g', id: 2 },
    { text: 'Huevos 6 ', id: 3 },
    { text: 'Sal', id: 4 }
  ];

  const IMAGES = [
  ];

  return (
    <div className="app">
      <LateralMenu noterows={NOTEROWS}/>
      <div className="note">
        <Note Allparagraphs={PARAGRAPHS} AllImages={IMAGES}/>
      </div>
    </div>
  );
}

function LateralMenu({ noterows }) {
  const [rows, setRows] = useState(noterows);
  
  function newNoteRow() {
    var titulo = prompt('Title of the Note');
    var newRow = {title: titulo, id: 0};
    setRows([...rows, newRow ])
  }

  return (
    <div className="lateral">
      <div style={{ textAlign: 'center'}}>
        <h2> My Notes </h2>
      </div>
      {rows.map(row => (
        <NoteRow noteRow={row}/>
      ))}
      <div className="noteButtonContainer">
        <button onClick={newNoteRow} className="noteButton"> ➕ New Note </button>
      </div>
    </div>
  );
}

function NoteRow({ noteRow }) {
  return (
    <div className="noteRow">
      <p  className="noteRowTitle"> { noteRow.title } </p>
      <button className='noteRowButton'> 🔗 </button>
      <button className='noteRowButton'> ❌ </button>
    </div>
  );
}

function Note({Allparagraphs, AllImages}) {
  const [paragraphs, setParagraphs] = useState(Allparagraphs);
  const [images, setImages] = useState(AllImages);

  function newImage(){
    setImages([...images, <ImageUploader />])
  }

  function newParagraph(){
    setParagraphs([...paragraphs, <Paragraph />])
  }

  const title = 'Tortilla de Patatas'

  return (
  <div className='noteContent'>
    <p contentEditable> {title} </p>
    {paragraphs.map(paragraph => (
      <>
        <Paragraph 
        text={paragraph.text}/>
        <br/> 
      </>
    ))}
    {images.map(image => (
      <>
        <ImageUploader />
        <br/> 
      </>
    ))}
    <div>
      <button className='paragraphButton' onClick={newParagraph}> New Paragraph </button>
      <button className='paragraphButton' onClick={newImage}> New Image </button>
    </div>
  </div>
  );
}

function Paragraph({text}) {
  return (
    <div className='paragraphStyle'>
      <textarea placeholder='Your text goes here'>{text}</textarea>
    </div>
  );
}

function ImageUploader() {
  const [image, setImage] = useState(null);

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

  return (
    <div>
      {image ? (
        <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      )}
    </div>
  );
}