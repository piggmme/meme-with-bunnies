export default function ControllerButton ({
  active = false,
  icon,
  title,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  active: boolean
  icon?: React.ReactNode
  title: string
}) {
  return (
    <button
      className={`
        flex flex-col justify-center items-center gap-2 text-xs whitespace-nowrap shrink-0 text-white
        ${active ? 'border-b-2 border-white pb-1' : 'border-b-2 border-transparent pb-1'}
        ${className ?? ''}
      `}
      {...props}
    >
      {icon}
      {title}
    </button>
  )
}
