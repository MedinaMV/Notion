import React from 'react';
import url from '../api/api-calls.js';

export default function ListElement({elements, noteId, listId}) {

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
      const request = await fetch(url + `/notes/${noteId}/${listId}/addListElement`, {
        method: 'POST', body: formData
      });
      const response = await request.json();
      setList([...list, <li key={response._id}>{item}</li>]);
      setItem('');
    }
  
    return (
      <div className="container">
        <div className="input-container">
          <input
            type='text'
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder='Add a element'
          />
          <button onClick={addElement} className="add-button">Add</button>
        </div>
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
}