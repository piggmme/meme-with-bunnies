import { useEffect, useImperativeHandle, useRef, type RefObject } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import useSelectImage from '../hooks/useSelectImage'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { Transformer } from 'react-konva'

interface ImageTransformerProps {
  imageRefs: RefObject<Record<string, KonvaImage>>
  stageRef: RefObject<KonvaStage | null>
  ref: RefObject<any | null>
}

export default function ImageTransformer ({
  imageRefs, stageRef, ref,
}: ImageTransformerProps) {
  const trRef = useRef<any>(null)
  const {
    selectedImageId,
    setSelectedImageId,
    resetSelectedImage,
  } = useSelectImage(imageRefs, stageRef, trRef)

  console.log({ stageRef, ref, trRef })

  useImperativeHandle(ref, () => ({
    setSelectedImageId,
    resetSelectedImage,
  }), [setSelectedImageId, resetSelectedImage])

  if (!selectedImageId) return null
  return <Transformer ref={trRef} />
}
