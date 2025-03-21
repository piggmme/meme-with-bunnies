import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
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
import { FaceIcon, BoxModelIcon, ImageIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { CONTROLLER_WIDTH, STUDIO_PADDING_Y } from '@/constants/style'
import ControllerButton from './ControllerButton'
import TextContoller from './TextContoller'
import GiphyFilter from '../Giphy/GiphyFilter'

type ControllerType = 'giphy' | 'background' | 'image'

const CANVAS_RATIO = 0.3
const CONTRALLER_RATIO = 1 - CANVAS_RATIO
const MARGIN_TOP = 10

export default function MemeController ({ stageRef, layerRef, studioRefHeight }: {
  stageRef: React.RefObject<KonvaStage | null>
  layerRef: React.RefObject<KonvaLayer | null>
  studioRefHeight: number
}) {
  const controllers = useRef<HTMLDivElement>(null)
  const [openedController, setOpenedController] = useState<ControllerType | null>(null)

  useEffect(() => {
    if (openedController === 'giphy') {
      updateCanvasRatio(window.innerHeight * CANVAS_RATIO)
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
  const sheetHeight = window.innerHeight - studioRefHeight - (STUDIO_PADDING_Y * 2)

  return (
    <div
      className='relative'
      style={{ marginTop: MARGIN_TOP, maxWidth: CONTROLLER_WIDTH }}
    >
      <div
        ref={controllers}
        style={{ maxWidth: CONTROLLER_WIDTH }}
        className='flex gap-8 py-3 px-5 w-fit overflow-x-auto hide-scrollbar'
      >
        <ControllerDrawer
          title='GIPHY'
          open={openedController === 'giphy'}
          setOpen={(open: boolean) => setOpenedController(open ? 'giphy' : null)}
          scrollToCanvas={scrollToCanvas}
          sheetHeight={window.innerHeight * CONTRALLER_RATIO - controllerHeight - MARGIN_TOP - STUDIO_PADDING_Y}
          icon={<FaceIcon width='25' height='25' />}
        >
          <DrawerHeader>
            <GiphyFilter />
          </DrawerHeader>
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
        <TextContoller />
      </div>
      <div className='absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-100'>
        <button>
          <ChevronRightIcon width='20' height='20' />
        </button>
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
      <ControllerButton
        active={open}
        onClick={() => {
          scrollToCanvas(!open)
          // fix: 컨트롤러 클릭시 캔버스 상단까지 스크롤 안하는 버그 때문에 우회하여 모달 trigger 클릭 처리
          setTimeout(() => buttonRef.current?.click(), 300)
        }}
        icon={icon}
        title={title}
      />
      <Drawer
        modal={modal}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerTrigger style={{ display: 'none' }} ref={buttonRef}>
        </DrawerTrigger>
        <DrawerContent style={{ height: `${sheetHeight}px` }}>
          <VisuallyHidden.Root>
            <DrawerTitle>{title}</DrawerTitle>
          </VisuallyHidden.Root>
          {children}
        </DrawerContent>
      </Drawer>
    </>
  )
}
