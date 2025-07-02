import React from 'react'
import  RichText  from '@/components/RichText'
import type { Petition } from '@/payload-types'

interface PetitionContentProps {
  petition: Petition
}

export const PetitionContent: React.FC<PetitionContentProps> = ({ petition }) => {
  const { description, categories, location } = petition

  return (
    <div className="space-y-6">
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {description && <RichText data={description} />}
      </div>
      
      {(categories || location) && (
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories && Array.isArray(categories) && categories.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    if (typeof category === 'object' && category.title) {
                      return (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                        >
                          {category.title}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}
            
            {location && typeof location === 'object' && location.name && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  Location
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
                  {location.name}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}