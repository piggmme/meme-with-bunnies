import { useImageUpload } from '../hooks/useImageUpload'
import type { EditorImage } from '../types/Editor'

interface ImageUploaderProps {
  addImage: (image: EditorImage) => void
}

export default function ImageUploader ({
  addImage,
}: ImageUploaderProps) {
  const { handleImageUpload } = useImageUpload(addImage)

  return (
    <input type='file' accept='image/*' onChange={handleImageUpload} />
  )
}
