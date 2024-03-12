//import { useState } from 'react';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <LateralMenu />
      <div className="note">
        <Note />
      </div>
    </div>
  );
}

function LateralMenu() {
  return (
    <div className="lateral">
      <h2> My Notes </h2>
        <div>
          <NoteRow />
          <NoteRow />
          <NoteRow />
        </div>
      <div className="noteButtonContainer">
        <button className="noteButton"> ➕ New Note </button>
      </div>
    </div>
  );
}

function NoteRow() {
  return (
    <div className="noteRow">
      <p className="noteTitle">Title</p>
      <div className="buttonsContainer">
        <button> 🔗 </button>
        <button> ❌ </button>
      </div>
    </div>
  );
}

function Note() {
  return (
  <>
    <h1>Title</h1>
    <Paragraph />
  </>
  );
}

function Paragraph() {
  return (
    <div>
      <input></input>
      <button> 💾 Save </button>
    </div>
  );
}