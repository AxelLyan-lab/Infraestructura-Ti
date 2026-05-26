import type { ReactNode } from 'react'
import { useThemeTokens } from '../theme/themeTokens'

type GlassPanelProps = {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
}

export function GlassPanel({ children, className = '', as: Tag = 'div' }: GlassPanelProps) {
  const t = useThemeTokens()

  return (
    <Tag
      className={[
        t.glass,
        t.glassHighlight,
        'transition-transform duration-500 will-change-transform',
        'motion-safe:hover:-translate-y-0.5',
        className,
      ].join(' ')}
    >
      <div className="relative z-10">{children}</div>
    </Tag>
  )
}
