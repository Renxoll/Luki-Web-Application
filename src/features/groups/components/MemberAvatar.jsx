import { memberColor, initials } from '../../../lib/memberColor'

const SIZES = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
}

export function MemberAvatar({ name, size = 'md' }) {
  const c = memberColor(name)
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-semibold ${c.bg} ${c.text} ${SIZES[size]}`}>
      {initials(name)}
    </span>
  )
}

export default MemberAvatar
