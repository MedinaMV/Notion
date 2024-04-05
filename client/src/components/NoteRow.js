
export default function NoteRow({ noteRow, manageNoteRows, setNoteSelected }) {

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
        fetch(`/notes/${noteRow._id}/deleteNote`, {
          method: 'DELETE',
          headers: { 'Content-type': 'application/json' }
        }).then(response => response.json())
          .then(data => console.log(data))
        manageNoteRows(noteRow, true);
        window.location.reload();
      }
    }
  
    return (
      <div onClick={handleClick} className="noteRow">
        <p className="noteRowTitle"> { noteRow.title } </p>
        <button className='noteRowButton'> 🔗 </button>
        <button onClick={deleteNote} className='noteRowButton'> ❌ </button>
      </div>
    );
}