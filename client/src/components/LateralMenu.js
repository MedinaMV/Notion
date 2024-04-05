import React from 'react';
import NoteRow from './NoteRow';

export default function LateralMenu({ setNoteSelected }) {
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
      (async () => {
        const request = await fetch('/notes/getAllNotes');
        const response = await request.json();
        setRows(response.notes ?? [])
      })(); 
    }, []);  
    
    async function handleClick() {
      let input = prompt('Set a title for your new Note');
      if(input) {
        fetch('/notes/createNote' , {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({title: input}) 
        }).then(response => response.json())
          .then(data => {
            const newRow = {title: input, _id: data._id};
            manageNoteRows(newRow, false);
          })
      }
    }
  
    function manageNoteRows(newRow, flag){
      flag ? rows.splice(rows.indexOf(newRow),1): setRows([...rows, newRow ]);
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