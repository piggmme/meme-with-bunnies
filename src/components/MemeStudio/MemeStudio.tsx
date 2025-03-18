import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import MemeCanvas from '../MemeCanvas/MemeCanvas'
import MemeController from '../MemeController/MemeController'
import { useMeasure } from 'react-use'

export default function MemeStudio () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const [studioRef, { height }] = useMeasure<HTMLDivElement>()

  return (
    <section className='flex flex-col items-center' ref={studioRef}>
      <MemeCanvas stageRef={stageRef} layerRef={layerRef} />
      <MemeController stageRef={stageRef} layerRef={layerRef} studioRefHeight={height ?? 0} />
    </section>
  )
}
