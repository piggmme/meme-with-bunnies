import { $editorImages } from '@/stores/editorState'
import { useStore } from '@nanostores/react'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { MemeImage } from '@/types/canvas'

export default function ImageUploadController () {
  const editorImages = useStore($editorImages)
  const addImage = (image: MemeImage) => $editorImages.set([...editorImages, image])
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
