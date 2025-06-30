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
import type { Tag, Location } from '@/payload-types'

interface ProjectsFilterProps {
  tags: Tag[]
  locations: Location[]
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ tags, locations }) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const router = useRouter()
  const searchParams = useSearchParams()

  const debouncedSearchValue = useDebounce(searchValue)

  // Project status options
  const statusOptions = [
    { label: 'Planning', value: 'planning' },
    { label: 'Active', value: 'active' },
    { label: 'Funded', value: 'funded' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Executed', value: 'executed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'On Hold', value: 'on_hold' },
  ]

  // Initialize state from URL params
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const tag = searchParams.get('tag') || ''
    const location = searchParams.get('location') || ''
    const status = searchParams.get('status') || ''

    setSearchValue(q)
    setSelectedTag(tag)
    setSelectedLocation(location)
    setSelectedStatus(status)
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearchValue) {
      params.set('q', debouncedSearchValue)
    }
    if (selectedTag) {
      params.set('tag', selectedTag)
    }
    if (selectedLocation) {
      params.set('location', selectedLocation)
    }
    if (selectedStatus) {
      params.set('status', selectedStatus)
    }

    const queryString = params.toString()
    router.push(`/projects${queryString ? `?${queryString}` : ''}`)
  }, [debouncedSearchValue, selectedTag, selectedLocation, selectedStatus, router])

  const handleTagChange = (value: string) => {
    setSelectedTag(value === 'all' ? '' : value)
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value === 'all' ? '' : value)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === 'all' ? '' : value)
  }

  const formatLocationDisplay = (location: Location) => {
    const parts = [location.name]
    if (location.city) parts.push(location.city)
    if (location.region) parts.push(location.region)
    return parts.join(', ')
  }

  return (
    <div className="bg-background border border-orange-600 rounded-lg md:rounded-xl lg:rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium mb-2 block">
            Search
          </Label>
          <Input
            id="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Type some word related to the project"
            className="w-full"
          />
        </div>

        {/* Location Dropdown */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            Location
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

        {/* Tag Dropdown */}
        <div>
          <Label htmlFor="tag" className="text-sm font-medium mb-2 block">
            Tag
          </Label>
          <Select value={selectedTag || 'all'} onValueChange={handleTagChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Dropdown */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium mb-2 block">
            Status
          </Label>
          <Select value={selectedStatus || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}