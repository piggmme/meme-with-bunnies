import { useEffect } from 'react'
import { useImageUpload } from '../hooks/useImageUpload'
import type { EditorImage } from '../types/Editor'

interface ImageUploaderProps {
  addImage: (image: EditorImage) => void
}

export default function ImageUploader ({
  addImage,
}: ImageUploaderProps) {
  const { imageElement, size, handleImageUpload, reset } = useImageUpload()

  useEffect(() => {
    if (imageElement) {
      addImage({
        id: String(Date.now()),
        image: imageElement,
        width: size.width,
        height: size.height,
      })
      reset()
    }
  }, [imageElement, size, addImage])

  return (
    <input type='file' accept='image/*' onChange={handleImageUpload} />
  )
}
