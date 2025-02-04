'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableItemProps {
  id: number
  children: React.ReactNode
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    isOver,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 200ms ease',
    zIndex: isDragging ? 100 : 0,
    opacity: isOver ? 0.5 : 1,
    position: 'relative' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative transition-all duration-200"
    >
      <div className={`${isDragging ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
      {isDragging && (
        <div className="absolute inset-0 bg-white rounded-lg shadow-lg">
          {children}
        </div>
      )}
    </div>
  )
}