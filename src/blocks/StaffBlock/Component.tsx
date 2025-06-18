import React from 'react'
import type { StaffBlock as StaffBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const StaffBlock: React.FC<StaffBlockProps> = ({
  title,
  selectedStaff,
  backgroundColor = 'bg-stone-100 dark:bg-stone-800',
}) => {
  if (!selectedStaff || selectedStaff.length === 0) {
    return null
  }

  return (
    <div className={cn('py-16', backgroundColor)}>
      <div className="container">
        {/* Section Title */}
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        )}

        {/* Staff Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 ">
          {selectedStaff.map((staffMember, index) => {
            if (typeof staffMember === 'string') return null

            return (
              <div key={index} className="text-center ">
                {/* Profile Picture */}

                <div className="w-full aspect-[3/4] mx-auto relative z-10">
                  <Media
                    resource={staffMember.profilePicture}
                    fill
                    imgClassName="w-full h-full object-cover rounded-lg aspect-square"
                  />
                </div>

                {/* Staff Info */}
                <div className="relative mx-8 shadow-lg space-y-2 z-20 p-4 -mt-10 rounded-2xl bg-white dark:bg-slate-900">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {staffMember.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    {staffMember.position}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
