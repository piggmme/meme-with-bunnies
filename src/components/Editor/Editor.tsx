import { useRef } from 'react'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import EditorController from './EditorController'
import { EditorCanvas } from './EditorCanvas'
import {
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger,
} from '../ui/sheet'
import { useStore } from '@nanostores/react'
import { $canvasPosition } from '@/stores/editorState'
import GiphySearch from '../Giphy/GiphySearch'

export default function Editor () {
  const stageRef = useRef<KonvaStage>(null)
  const layerRef = useRef<KonvaLayer>(null)
  const canvasPosition = useStore($canvasPosition)

  const sheetHeight = Math.max(window.innerHeight - canvasPosition.y, window.innerHeight * 0.4)

  return (
    <>
      <EditorCanvas stageRef={stageRef} layerRef={layerRef} />

      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side='bottom' style={{ height: `${sheetHeight}px` }}>
          <SheetTitle>짤을 꾸며보세용</SheetTitle>
          <SheetDescription>
            <EditorController stageRef={stageRef} layerRef={layerRef} />
            <GiphySearch />
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  )
}
