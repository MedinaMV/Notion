import React from 'react';
import LateralMenu from "./LateralMenu";
import Note from "./Note";
import '../App.css';

export default function MainPage() {
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