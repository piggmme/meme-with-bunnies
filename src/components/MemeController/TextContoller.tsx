import { resetCanvasState } from '@/stores/canvasState'
import ControllerButton from './ControllerButton'
import { TextIcon } from '@radix-ui/react-icons'

export default function TextContoller () {
  return (
    <ControllerButton
      onClick={resetCanvasState}
      icon={<TextIcon width={25} height={25} />}
      title='텍스트'
    />
  )
}
