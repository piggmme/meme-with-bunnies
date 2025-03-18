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
import { FaceIcon, BoxModelIcon, ImageIcon } from '@radix-ui/react-icons'
import { INNDER_PADDING } from '@/constants/style'

type ControllerType = 'giphy' | 'background' | 'image'

const MARGIN_TOP = 20

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
    } else {
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
    <div
      className='relative'
      style={{ marginTop: MARGIN_TOP, maxWidth: window.innerWidth - INNDER_PADDING * 2 }}
    >
      <div className='absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10' />
      <div
        ref={controllers}
        className='bg-white shadow-md flex gap-2 py-6 px-8 overflow-x-auto hide-scrollbar'
        style={{ maxWidth: window.innerWidth - INNDER_PADDING * 2 }}
      >
        <ControllerDrawer
          title='GIPHY'
          open={openedController === 'giphy'}
          setOpen={(open: boolean) => setOpenedController(open ? 'giphy' : null)}
          scrollToCanvas={scrollToCanvas}
          sheetHeight={window.innerHeight * 0.6 - controllerHeight - MARGIN_TOP}
          icon={<FaceIcon width='25' height='25' />}
        >
          <GiphyList />
        </ControllerDrawer>

        <ControllerDrawer
          title='배경색'
          open={openedController === 'background'}
          setOpen={(open: boolean) => setOpenedController(open ? 'background' : null)}
          scrollToCanvas={scrollToCanvas}
          sheetHeight={sheetHeight}
          icon={<BoxModelIcon width='25' height='25' />}
        >
          <BackgroundController />
        </ControllerDrawer>

        <ControllerDrawer
          title='이미지'
          open={openedController === 'image'}
          setOpen={(open: boolean) => setOpenedController(open ? 'image' : null)}
          scrollToCanvas={scrollToCanvas}
          sheetHeight={sheetHeight}
          icon={<ImageIcon width='25' height='25' />}
        >
          <ImageUploadController />
        </ControllerDrawer>

        <SaveController stageRef={stageRef} layerRef={layerRef} />

        <ResetController />
      </div>
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
  icon,
}:
{
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  scrollToCanvas: (open: boolean) => void
  sheetHeight: number
  modal?: boolean
  icon?: React.ReactNode
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        variant='ghost'
        className='text-gray-600 flex flex-col text-xs'
        onClick={() => {
          scrollToCanvas(!open)
          // fix: 컨트롤러 클릭시 캔버스 상단까지 스크롤 안하는 버그 때문에 우회하여 모달 trigger 클릭 처리
          setTimeout(() => buttonRef.current?.click(), 300)
        }}
      >
        {icon}
        {title}
      </Button>
      <Drawer
        modal={modal}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerTrigger style={{ display: 'none' }} ref={buttonRef}>
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
