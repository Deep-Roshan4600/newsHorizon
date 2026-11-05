import { useEffect, useState } from "react";

const storageKey = "newsHorizonNotes";

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(savedNotes) ? savedNotes : [];
  } catch {
    return [];
  }
}

export default function NotesPage() {
  const [notes, setNotes] = useState(loadNotes);
  const [noteText, setNoteText] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  function saveNote(event) {
    event.preventDefault();

    const text = noteText.trim();
    if (!text) return;

    if (editingId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId ? { ...note, text } : note,
        ),
      );
      setEditingId(null);
    } else {
      setNotes((currentNotes) => [
        { id: Date.now(), text },
        ...currentNotes,
      ]);
    }

    setNoteText("");
  }

  function editNote(note) {
    setNoteText(note.text);
    setEditingId(note.id);
  }

  function deleteNote(id) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id),
    );
  }

  function downloadNote(note) {
    const file = new Blob([note.text], { type: "text/plain" });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "news-note.txt";
    link.click();

    URL.revokeObjectURL(fileUrl);
  }

  function cancelEdit() {
    setNoteText("");
    setEditingId(null);
  }

  return (
    <>
      <section className="page-card">
        <p className="eyebrow">YOUR NOTEBOOK</p>
        <h1>Keep a thought.</h1>
        <p>Your notes are saved in this browser.</p>
      </section>

      <form className="note-form" onSubmit={saveNote}>
        <label htmlFor="note-text">
          {editingId !== null ? "Edit your note" : "Write a new note"}
        </label>

        <textarea
          id="note-text"
          rows="4"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Type a thought you want to remember..."
        />

        <div className="note-buttons">
          {editingId !== null && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}

          <button type="submit" disabled={!noteText.trim()}>
            {editingId !== null ? "Save changes" : "Add note"}
          </button>
        </div>
      </form>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="status-message">No notes yet. Add one above.</p>
        ) : (
          notes.map((note) => (
            <article className="note-card" key={note.id}>
              <p>{note.text}</p>

              <div className="note-buttons">
                <button type="button" onClick={() => editNote(note)}>
                  Edit
                </button>
                <button type="button" onClick={() => downloadNote(note)}>
                  Download
                </button>
                <button type="button" onClick={() => deleteNote(note.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}