import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import MemeCanvas from '../MemeCanvas/MemeCanvas'
import MemeController from '../MemeController/MemeController'

export default function MemeStudio () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)

  return (
    <>
      <MemeCanvas stageRef={stageRef} layerRef={layerRef} />
      <MemeController stageRef={stageRef} layerRef={layerRef} />
    </>
  )
}
