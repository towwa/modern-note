import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Create new note
export async function POST(request: Request) {
  const { title, content, tags } = await request.json()
  
  const note = await prisma.note.create({
    data: {
      title,
      content,
      tags
    }
  })
  
  return NextResponse.json(note)
}

// Get all notes
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: {
      order: 'asc'
    }
  })
  
  return NextResponse.json(notes)
}

// Delete note
export async function DELETE(request: Request) {
  const { id } = await request.json()
  
  await prisma.note.delete({
    where: { id }
  })
  
  return NextResponse.json({ success: true })
}