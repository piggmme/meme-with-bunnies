import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import EditorController from './EditorController'
import { EditorCanvas } from './EditorCanvas'

export default function Editor () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)

  return (
    <div>
      <EditorCanvas stageRef={stageRef} layerRef={layerRef} />
      <EditorController stageRef={stageRef} layerRef={layerRef} />
    </div>
  )
}
