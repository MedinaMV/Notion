import React from 'react';
import Note from "../Note.js";
import { useLocation } from 'react-router-dom';
import '../../App.css';
import URL from '../../api/api-calls';

export default function FriendPage() {
    const [noteSelected, setNoteSelected] = React.useState(null);
    const location = useLocation();
    const rows = location.state.rows;

    return (
        <div className="app">
            <MenuLateral rows={rows} setNoteSelected={setNoteSelected}/>
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

function MenuLateral({ rows, setNoteSelected }) {

    const handleClick = async (noteId,title) => {
        const request = await fetch(URL + `/notes/${noteId}/getNote`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const response = await request.json();
        setNoteSelected({ title: title, paragraphs: response.elements, noteId: noteId });
    }

    return (
        <div className="lateral">
            <div style={{ textAlign: 'center', margin: '10px auto' }}>
                <h3> Notes </h3>
            </div>
            {rows.map(row => (
                <div onClick={() => handleClick(row.id, row.title)} className="noteRow">
                    <p className="noteRowTitle"> {row.title} </p>
                </div>
            ))}
        </div>
    );
}