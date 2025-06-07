import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={185.27}
      height={100}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[185.27px] w-full h-[100px]', className)}
      src="/assets/logo1.png"
    />
  )
}
