'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category, Location } from '@/payload-types'

interface PostsFilterProps {
  categories: Category[]
  locations: Location[]
}

export const PostsFilter: React.FC<PostsFilterProps> = ({ categories, locations }) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')

  const router = useRouter()
  const searchParams = useSearchParams()

  const debouncedSearchValue = useDebounce(searchValue)

  // Initialize state from URL params
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const location = searchParams.get('location') || ''

    setSearchValue(q)
    setSelectedCategory(category)
    setSelectedLocation(location)
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearchValue) {
      params.set('q', debouncedSearchValue)
    }
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    if (selectedLocation) {
      params.set('location', selectedLocation)
    }

    const queryString = params.toString()
    router.push(`/posts${queryString ? `?${queryString}` : ''}`)
  }, [debouncedSearchValue, selectedCategory, selectedLocation, router])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? '' : value)
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value === 'all' ? '' : value)
  }

  const formatLocationDisplay = (location: Location) => {
    const parts = [location.name]
    if (location.city) parts.push(location.city)
    if (location.region) parts.push(location.region)
    return parts.join(', ')
  }

  return (
    <div className="bg-background border border-orange-600 rounded-lg md:rounded-xl lg:rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-2">
          <Label htmlFor="search" className="text-sm font-medium mb-2 block">
            Search
          </Label>
          <Input
            id="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Type some word related to the activity"
            className="w-full"
          />
        </div>

        {/* Location Dropdown */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            Address
          </Label>
          <Select value={selectedLocation || 'all'} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {formatLocationDisplay(location)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Dropdown */}
        <div>
          <Label htmlFor="category" className="text-sm font-medium mb-2 block">
            Category
          </Label>
          <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
