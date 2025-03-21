import { resetCanvasState } from '@/stores/canvasState'
import { ResetIcon } from '@radix-ui/react-icons'
import ControllerButton from './ControllerButton'

export default function ResetController () {
  return (
    <ControllerButton
      onClick={resetCanvasState}
      icon={<ResetIcon width={25} height={25} />}
      title='초기화'
    />
  )
}
