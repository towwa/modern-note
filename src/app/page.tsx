'use client'

import { useState, useEffect } from 'react'
import useNoteStore from '@/store/noteStore'
import { Trash2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableItem } from '@/components/sortable-item'

export default function Home() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const { notes, addNote, fetchNotes, deleteNote, setNotes } = useNoteStore()

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = notes.findIndex(note => note.id === active.id)
      const newIndex = notes.findIndex(note => note.id === over.id)
      const newNotes = arrayMove(notes, oldIndex, newIndex)
      
      // Update local state
      setNotes(newNotes)
      
      // Update server
      await fetch('/api/notes/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: newNotes.map((note, index) => ({
            id: note.id,
            order: index
          }))
        })
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, tags }),
    })
    
    const newNote = await response.json()
    addNote(newNote)
    
    setTitle('')
    setContent('')
    setTags([])
  }

  const handleDelete = async (id: number) => {
    await deleteNote(id)
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">New Note</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                rows={4}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Notes</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[
              ({ transform }) => ({
                ...transform,
                x: transform.x * 1.2,
                y: transform.y * 1.2,
              })
            ]}
          >
            <SortableContext
              items={notes}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note) => (
                  <SortableItem key={note.id} id={note.id}>
                    <div className="relative p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDelete(note.id)
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
                      <p className="text-gray-600 mb-4">{note.content}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </main>
  )
}
