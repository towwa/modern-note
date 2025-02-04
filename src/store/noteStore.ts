import { create } from 'zustand'

interface Note {
  id: number
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  order: number
}

interface NoteStore {
  notes: Note[]
  addNote: (note: Note) => void
  setNotes: (notes: Note[]) => void
  fetchNotes: () => Promise<void>
  deleteNote: (id: number) => Promise<void>
  togglePin: (id: number) => Promise<void>
  updateOrder: (notes: Note[]) => Promise<void>
}

const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  setNotes: (notes) => set({ notes }),
  fetchNotes: async () => {
    const response = await fetch('/api/notes')
    const notes = await response.json()
    set({ notes })
  },
  deleteNote: async (id) => {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id)
    }))
  },
  togglePin: async (id) => {
    const {notes} = useNoteStore.getState()
    const note = notes.find((n) => n.id === id)
    if (!note) return
    
    const updatedNote = await fetch('/api/notes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        pinned: !note.pinned
      }),
    }).then(res => res.json())
    
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? updatedNote : n
      )
    }))
  },
  updateOrder: async (notes) => {
    await fetch('/api/notes/order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    })
    set({ notes })
  }
}))

export default useNoteStore