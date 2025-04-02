import React, { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from 'next-themes'

const Theme = ({children}:{children:ReactNode}) => {
      
  return (
    <ThemeProvider attribute="class" defaultTheme={"Dark"} enableSystem disableTransitionOnChange>
     {children}
    </ThemeProvider>
  )
}

export default Theme