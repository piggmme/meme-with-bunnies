import { Button } from '../ui/button'
import GiphyList from '../Giphy/GiphyList'
import BackgroundController from './BackgroundController'
import ImageUploadController from './ImageUploadController'
import SaveController from './SaveController'
import ResetController from './ResetController'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { useRef, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const DEFAULT_SHEET_HEIGHT = window.innerHeight * 0.4

export default function MemeController ({ stageRef, layerRef, studioRefHeight }: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
  studioRefHeight: number
}) {
  const controllers = useRef<HTMLDivElement>(null)

  const scrollToCanvas = (open: boolean) => {
    if (open) {
      const container = stageRef.current?.container()
      if (!container) return

      container.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const sheetHeight = Math.max(window.innerHeight - studioRefHeight - 10, DEFAULT_SHEET_HEIGHT)

  return (
    <div ref={controllers}>
      <ControllerDrawer modal={false} title='GIPHY' scrollToCanvas={scrollToCanvas} sheetHeight={sheetHeight}>
        <GiphyList height={sheetHeight} />
      </ControllerDrawer>

      <ControllerDrawer title='배경색' scrollToCanvas={scrollToCanvas} sheetHeight={sheetHeight}>
        <BackgroundController />
      </ControllerDrawer>

      <ControllerDrawer title='이미지' scrollToCanvas={scrollToCanvas} sheetHeight={sheetHeight}>
        <ImageUploadController />
      </ControllerDrawer>

      <SaveController stageRef={stageRef} layerRef={layerRef} />

      <ResetController />
    </div>
  )
}

function ControllerDrawer ({
  title, modal = true, children, scrollToCanvas, sheetHeight,
}:
{
  title: string
  children: React.ReactNode
  scrollToCanvas: (open: boolean) => void
  sheetHeight: number
  modal?: boolean
}) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button onClick={() => {
        scrollToCanvas(!open)
        setTimeout(() => buttonRef.current?.click(), 300)
      }}
      >
        {title}
      </Button>
      <Drawer
        modal={modal}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerTrigger style={{ visibility: 'hidden' }} ref={buttonRef}>
        </DrawerTrigger>
        <DrawerContent style={{ height: `${sheetHeight}px` }}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    </>
  )
}
