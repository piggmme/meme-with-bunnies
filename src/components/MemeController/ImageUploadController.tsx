import { $canvasImages } from '@/stores/canvasState'
import { useStore } from '@nanostores/react'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { CanvasImage } from '@/types/canvas'

export default function ImageUploadController () {
  const canvasImages = useStore($canvasImages)
  const addImage = (image: CanvasImage) => $canvasImages.set([...canvasImages, image])
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
