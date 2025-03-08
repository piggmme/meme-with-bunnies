import type { KonvaEventObject, Node, NodeConfig } from 'konva/lib/Node'
import { Image as KonvaImage } from 'konva/lib/shapes/Image'
import { useEffect, useState, type RefObject } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'

export default function useSelectImage (
  imageRefs: RefObject<Record<string, KonvaImage>>,
  stageRef: RefObject<KonvaStage | null>,
  trRef: RefObject<any | null>,
) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

  useEffect(() => {
    if (selectedImageId && trRef.current) {
      trRef.current.nodes([imageRefs.current[selectedImageId]])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedImageId, trRef.current])

  const resetSelectedImage = (event: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
    if (event.target === stageRef.current) {
      setSelectedImageId(null)
    }
  }

  return {
    selectedImageId,
    setSelectedImageId,
    resetSelectedImage,
  }
}
