'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('system')

  React.useEffect(() => {
    // Load theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) setTheme(savedTheme)
  }, [])

  React.useEffect(() => {
    // Apply theme to document element
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      // system or no preference: remove both classes or handle accordingly
      root.classList.remove('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
