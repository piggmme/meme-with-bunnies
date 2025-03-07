import type { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'

export default function useSelectImage (imageRefs: RefObject<Record<string, KonvaImage>>, stageRef: RefObject<KonvaStage | null>) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const trRef = useRef(null)

  useEffect(() => {
    if (selectedImageId && trRef.current) {
      trRef.current.nodes([imageRefs.current[selectedImageId]])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedImageId])

  const resetSelectedImage = (event: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if (event.target === stageRef.current) {
      setSelectedImageId(null)
    }
  }

  return {
    selectedImageId,
    setSelectedImageId,
    trRef,
    resetSelectedImage,
  }
}
