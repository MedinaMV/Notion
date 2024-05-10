import React from 'react';
import ListElement from './ListElement';
import url from '../api/api-calls.js';

export default function Paragraph({ type, text, noteId, elements, element_id }) {
  const [image, setImage] = React.useState(text);
  const showImageInput = (type === 'image' ? true : false);
  const isListElement = (type === 'list' ? true : false);
  const [paragraph, setParagraph] = React.useState('');

  const handleImageChange = async (event) => {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append('image', file);
    if (file) {
      const request = await fetch(url + `/notes/${noteId}/${element_id}/updateImage`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const response = await request.json();
      setImage(response.url);
    }
  };

  const handleStopTyping = React.useCallback(async () => {
    if (paragraph !== '') {
      const request = await fetch(url + `/notes/${noteId}/${element_id}/editParagraph`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ paragraph: paragraph }),
        credentials: 'include'
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
    <div className='container'>
      <div className='paragraphStyle'>
        {showImageInput ? (
          image ? (
            <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          ) : (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )
        ) : (
          isListElement ? (
            <ListElement elements={elements} noteId={noteId} listId={element_id} />
          ) : (
            <textarea onChange={handleChange} placeholder='Your text goes here'>{text}</textarea>
          )
        )}
      </div>
    </div>

  );
}