/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface NoteOrderUpdate {
  id: number
  order: number
}

export async function PUT(request: Request) {
  const { notes } = await request.json() as { notes: NoteOrderUpdate[] }

  try {
    await prisma.$transaction(
      notes.map((note) =>
        prisma.note.update({
          where: { id: note.id },
          data: {
            order: note.order
          }
        })
      )
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating note order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update note order' },
      { status: 500 }
    )
  }
}