'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">
          <div className="flex gap-2">
            <SunMoonIcon className="w-5 h-5" /> Auto
          </div>
        </SelectItem>
        <SelectItem value="light">
          <div className="flex gap-2">
            <SunIcon className="w-5 h-5" /> Light
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex gap-2">
            <MoonIcon className="w-5 h-5" /> Dark
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
