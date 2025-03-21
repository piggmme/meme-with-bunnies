export default function ControllerButton ({
  icon,
  title,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  icon?: React.ReactNode
  title: string
}) {
  return (
    <button
      className={'text-white flex flex-col justify-center items-center gap-2 text-xs whitespace-nowrap shrink-0' + className}
      {...props}
    >
      {icon}
      {title}
    </button>
  )
}
