import React from 'react';
import './App.css';
import LateralMenu from './components/LateralMenu';
import Note from './components/Note';

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