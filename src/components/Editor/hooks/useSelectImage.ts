import { useState } from 'react'

export default function useSelectImage () {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectImage = (id: string) => {
    setSelectedId(id)
  }

  const deselectImage = () => {
    setSelectedId(null)
  }

  return {
    selectedId,
    selectImage,
    deselectImage,
  }
}
