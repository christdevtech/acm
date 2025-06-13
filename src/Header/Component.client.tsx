'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { Menu, X, SearchIcon } from 'lucide-react'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const navItems = data?.navItems || []
  const buttons = data?.buttons || []

  useEffect(() => {
    setHeaderTheme(null)
    // Close mobile menu on route change
    closeMobileMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Start closing animation
      setIsAnimating(true)
      setTimeout(() => {
        setIsMobileMenuOpen(false)
        setIsAnimating(false)
      }, 500) // Match transition duration
    } else {
      // Open menu - start with animation state
      setIsMobileMenuOpen(true)
      setIsAnimating(true)
      // Allow a frame for the DOM to update, then start animation
      requestAnimationFrame(() => {
        setIsAnimating(false)
      })
    }
  }

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsMobileMenuOpen(false)
        setIsAnimating(false)
      }, 500)
    }
  }

  return (
    <>
      <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
        <div className="py-2 flex justify-between items-center">
          <Link href="/">
            <Logo loading="eager" priority="high" className="" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <HeaderNav data={data} />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {(isMobileMenuOpen || isAnimating) && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-500 ease-in-out ${
              isMobileMenuOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full bg-background border-l border-border shadow-xl transition-transform duration-500 ease-in-out ${
              isMobileMenuOpen && !isAnimating ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              width: 'min(80vw, 350px)',
            }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/" onClick={closeMobileMenu}>
                <Logo loading="eager" priority="high" className="" />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              <nav className="flex-1 px-4 py-6">
                {/* Navigation Items */}
                <div className="space-y-4 mb-8">
                  {navItems.map(({ link }, i) => (
                    <div
                      key={i}
                      onClick={closeMobileMenu}
                      className={`transform transition-all duration-500 ease-in-out ${
                        isMobileMenuOpen && !isAnimating
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <CMSLink
                        {...link}
                        appearance="link"
                        className="block py-2 text-lg font-medium hover:text-primary transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="space-y-3 mb-8">
                  {buttons.map(({ link, buttonClasses }, i) => (
                    <div
                      key={i}
                      onClick={closeMobileMenu}
                      className={`transform transition-all duration-500 ease-in-out ${
                        isMobileMenuOpen && !isAnimating
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${(navItems.length + i) * 50}ms` }}
                    >
                      <CMSLink
                        {...link}
                        className={cn('block w-full text-center', buttonClasses)}
                      />
                    </div>
                  ))}
                </div>

                {/* Search Link */}
                <Link
                  href="/search"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 py-2 text-lg font-medium hover:text-primary transition-all duration-500 ease-in-out ${
                    isMobileMenuOpen && !isAnimating
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${(navItems.length + buttons.length) * 50}ms` }}
                >
                  <SearchIcon className="w-5 h-5" />
                  <span>Search</span>
                </Link>

                <div className="flex gap-1 items-center mt-16">
                  <span className="font-semibold">Theme</span>
                  <ThemeSelector />
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
