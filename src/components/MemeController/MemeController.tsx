import { Button } from '../ui/button'
import GiphyList from '../Giphy/GiphyList'
import BackgroundController from './BackgroundController'
import ImageUploadController from './ImageUploadController'
import SaveController from './SaveController'
import ResetController from './ResetController'
import { Stage as KonvaStage } from 'konva/lib/Stage'
import { Layer as KonvaLayer } from 'konva/lib/Layer'
import { useEffect, useRef, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { resetCanvasRatio, updateCanvasRatio } from '@/stores/canvasState'

type ControllerType = 'giphy' | 'background' | 'image'

export default function MemeController ({ stageRef, layerRef, studioRefHeight }: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
  studioRefHeight: number
}) {
  const controllers = useRef<HTMLDivElement>(null)
  const [openedController, setOpenedController] = useState<ControllerType | null>(null)

  useEffect(() => {
    if (openedController === 'giphy') {
      updateCanvasRatio(window.innerHeight * 0.4)
    }
    if (openedController === null) {
      resetCanvasRatio()
    }
  }, [openedController])

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
  const controllerHeight = controllers.current?.getBoundingClientRect().height ?? 0
  const sheetHeight = window.innerHeight - studioRefHeight - 10

  return (
    <div ref={controllers}>
      <ControllerDrawer
        title='GIPHY'
        open={openedController === 'giphy'}
        setOpen={(open: boolean) => setOpenedController(open ? 'giphy' : null)}
        scrollToCanvas={scrollToCanvas}
        sheetHeight={window.innerHeight * 0.6 - controllerHeight}
      >
        <GiphyList />
      </ControllerDrawer>

      <ControllerDrawer
        title='배경색'
        open={openedController === 'background'}
        setOpen={(open: boolean) => setOpenedController(open ? 'background' : null)}
        scrollToCanvas={scrollToCanvas}
        sheetHeight={sheetHeight}
      >
        <BackgroundController />
      </ControllerDrawer>

      <ControllerDrawer
        title='이미지'
        open={openedController === 'image'}
        setOpen={(open: boolean) => setOpenedController(open ? 'image' : null)}
        scrollToCanvas={scrollToCanvas}
        sheetHeight={sheetHeight}
      >
        <ImageUploadController />
      </ControllerDrawer>

      <SaveController stageRef={stageRef} layerRef={layerRef} />

      <ResetController />
    </div>
  )
}

function ControllerDrawer ({
  title,
  open,
  setOpen,
  modal = false,
  children,
  scrollToCanvas,
  sheetHeight,
}:
{
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  scrollToCanvas: (open: boolean) => void
  sheetHeight: number
  modal?: boolean
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button onClick={() => {
        scrollToCanvas(!open)
        // fix: 컨트롤러 클릭시 캔버스 상단까지 스크롤 안하는 버그 때문에 우회하여 모달 trigger 클릭 처리
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
