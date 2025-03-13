import { $editorImages } from '@/stores/editorState'
import { useStore } from '@nanostores/react'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { EditorImage } from '@/types/Editor'

export default function ImageUploadController () {
  const editorImages = useStore($editorImages)
  const addImage = (image: EditorImage) => $editorImages.set([...editorImages, image])
  const { handleImageUpload } = useImageUpload(addImage)

  return (
    <input
      type='file'
      accept='image/*'
      onChange={(e) => {
        handleImageUpload(e)
        e.target.value = ''
      }}
    />
  )
}
