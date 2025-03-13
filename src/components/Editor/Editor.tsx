import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { EditorCanvas } from './EditorCanvas'
import {
  Sheet, SheetContent, SheetDescription, SheetTrigger,
} from '../ui/sheet'
import { useStore } from '@nanostores/react'
import { $canvasPosition } from '@/stores/editorState'
import GiphySearch from '../Giphy/GiphySearch'
import BackgroundController from '../Controller/BackgroundController'
import ImageUploadController from '../Controller/ImageUploadController'
import { Button } from '../ui/button'
import SaveController from '../Controller/SaveController'

export default function Editor () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const canvasPosition = useStore($canvasPosition)

  const sheetHeight = Math.max(window.innerHeight - canvasPosition.y, window.innerHeight * 0.4)

  return (
    <>
      <EditorCanvas stageRef={stageRef} layerRef={layerRef} />

      <Sheet>
        <SheetTrigger>
          <Button>GIPHY</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <SheetDescription>
            <GiphySearch />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger>
          <Button>배경색</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <SheetDescription>
            <BackgroundController />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger>
          <Button>이미지 업로드</Button>
        </SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <SheetDescription>
            <ImageUploadController />
          </SheetDescription>
        </SheetContent>
      </Sheet>

      <SaveController stageRef={stageRef} layerRef={layerRef} />
    </>
  )
}
