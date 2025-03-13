import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import BackgroundController from '../Controller/BackgroundController'
import ImageUploadController from '../Controller/ImageUploadController'

export default function EditorController ({
  stageRef,
  layerRef,
}: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
}) {
  return (
    <div>
      <BackgroundController />
      <ImageUploadController stageRef={stageRef} layerRef={layerRef} />
    </div>
  )
}
