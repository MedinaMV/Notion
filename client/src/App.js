import * as React from 'react';
import './App.css';

function App() {
  const [text, setText] = React.useState("Perras")
  return (
    <> 
      <div className='perras'>{text}</div>
      <button onClick={() => {
        setText("Hola")
      }}></button>
    </>
    
  );
}

export default App;