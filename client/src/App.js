import React from 'react';
import './App.css';

export default function App() {
  const [noteSelected, setNoteSelected] = React.useState(null);


  return (
    <div className="app">
      <LateralMenu setNoteSelected={setNoteSelected} />
      <div className="note">
        {noteSelected && (
          <Note 
            title={noteSelected.title}
            elements={noteSelected.paragraphs}
            noteId={noteSelected.noteId} 
            setNoteSelected={setNoteSelected}
          />
        )}
      </div>
    </div>
  );
}

function LateralMenu({ setNoteSelected }) {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const request = await fetch('/notes/getAll');
      const response = await request.json();
      setRows(response.notes ?? [])
    })(); 
  }, []);  
  
  async function handleClick() {
    let input = prompt('Set a title for your new Note');
    
    fetch('/notes/create' , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({title: input}) 
    }).then(response => response.json())
      .then(data => {
        const newRow = {title: input, _id: data._id};
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
        key={row._id}
        manageNoteRows={manageNoteRows}
        setNoteSelected={setNoteSelected}
        />
      ))}
      <div className="noteButtonContainer">
        <button onClick={handleClick} className="noteButton"> ➕ New Note </button>
      </div>
    </div>
  );
}

function NoteRow({ noteRow, manageNoteRows, setNoteSelected }) {

  async function handleClick() {
    const request = await fetch(`/notes/${noteRow._id}/getNote`);
    const response = await request.json();

    setNoteSelected({ 
      title: noteRow.title, 
      paragraphs: response.elements, 
      noteId: noteRow._id 
    });
  }

  function deleteNote() {
    if(window.confirm('Are you sure about deleting this note?')){
      fetch(`/notes/${noteRow._id}/delete`, {
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

function Note({ title, elements, noteId, setNoteSelected }) {

  async function newParagraph(event){
    const flag = event.target.getAttribute('data');
    let Id = '-1';
    if (flag === 'paragraph') {
      const request = await fetch(`/notes/${noteId}/addParagraph`, { method: 'POST', headers: { 'Content-type' : 'application/json' }});
      const body = await request.json();
      Id = body._id;
      
      let newElements = elements;
      newElements.push({ type: flag, content: '', _id: Id });

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    } else if (flag === 'list') {
      const request = await fetch(`/notes/${noteId}/addList`, { method: 'POST', headers: { 'Content-type' : 'application/json' }});
      const body = await request.json();

      let newElements = elements;
      newElements.push({ type: flag, items: [{ content: '' }], _id: Id });
      Id = await body._id;

      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    } else {
      let newElements = elements;
      newElements.push({ type: flag, text: '', _id: Id });
      
      setNoteSelected(prevState => ({ ...prevState, elements: newElements }));
    }
  }

  return (
  <div className='noteContent'>
    <p contentEditable> {title} </p>
    {elements ? elements.map(element => (
      <>
        <Paragraph 
          key={element._id}
          text={element.content}
          type={element.type}
          noteId={noteId}
          element_id={element._id}
          elements={element}/> 
        <br/> 
      </>
    )) : <p>No elements</p>
    }
    <div>
      <button className='paragraphButton' onClick={newParagraph} data='paragraph'> New Paragraph </button>
      <button className='paragraphButton' onClick={newParagraph} data='image'> New Image </button>
      <button className='paragraphButton' onClick={newParagraph} data='list'> New List </button>
    </div>
  </div>
  );
}

function Paragraph({ type, text, noteId, elements, element_id }) {
  const [image, setImage] = React.useState(text);
  const showImageInput = (type === 'image' ? true : false);
  const isListElement = (type === 'list' ? true : false);
  const [paragraph, setParagraph] = React.useState('');

  const handleImageChange = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append('image', file);
    if (file) {
      const request = await fetch(`/notes/${noteId}/addImage`, {
        method: 'POST',
        body: formData
      });
      const response = await request.json();
      setImage(response.url);
    }
  };

  const handleStopTyping = React.useCallback(async () => { 
    if(paragraph !== ''){
      const request = await fetch(`/notes/${noteId}/${element_id}/editParagraph`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({paragraph: paragraph}) 
      })
      await request.json();
    }
  }, [element_id, noteId, paragraph]);

  React.useEffect(() => {
    const typingTimer = setTimeout(handleStopTyping, 1000);
    return () => {
      clearTimeout(typingTimer);
    };
  }, [paragraph, handleStopTyping]);

  const handleChange = (event) => {
    const newParagraph = event.target.value;
    setParagraph(newParagraph);
  };

  return (
    <div className='paragraphStyle'>
      {showImageInput ? (
        image ? (
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )
      ) : (
        isListElement ? (
          <ListElement elements={elements} noteId={noteId} listId={element_id}/>
        ) : (
          <textarea onChange={handleChange} placeholder='Your text goes here'>{text}</textarea>
        )
      )}
    </div>
  );
}

function ListElement({elements, noteId, listId}) {

  var items = elements.items;
  let listItems = [];
  for (var i = 0; i < items.length; i++) {
    if(items[i].content !== 'null'){
      listItems.push(<li>{items[i].content}</li>)
    }
  }

  const [list, setList] = React.useState(listItems);
  const [item, setItem] = React.useState(null);

  const addElement = async () => {
    const formData = new FormData();
    formData.append('element', item);
    const request = await fetch(`/notes/${noteId}/${listId}/addListElement`, {
      method: 'POST', body: formData
    });
    const response = await request.json();
    setList([...list, <li key={response._id}>{item}</li>]);
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