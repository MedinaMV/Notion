import url from '../api/api-calls.js';

export default function NoteRow({ noteRow, manageNoteRows, setNoteSelected }) {

  async function handleClick() {
    const request = await fetch(url + `/notes/${noteRow._id}/getNote`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const response = await request.json();

    setNoteSelected({ title: noteRow.title, paragraphs: response.elements, noteId: noteRow._id });
  }

  async function deleteNote() {
    if (window.confirm('Are you sure about deleting this note?')) {
      const request = await fetch(url + `/notes/${noteRow._id}/deleteNote`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
        credentials: 'include'
      });
      await request.json();
      manageNoteRows(noteRow, true);
      setNoteSelected(null);
    }
  }

  return (
    <div onClick={handleClick} className="noteRow">
      <p className="noteRowTitle"> {noteRow.title} </p>
      <button className='noteRowButton'> 🔗 </button>
      <button onClick={deleteNote} className='noteRowButton'> ❌ </button>
    </div>
  );
}