import React from 'react'

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  )
}
