import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(() => {
    // During SSR, window is undefined, so start as undefined or false
    if (typeof window === "undefined") return undefined
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return // safety check for SSR

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    mql.addEventListener("change", onChange)
    // Set initial value (in case window resized before effect runs)
    setIsMobile(mql.matches)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return boolean, fallback to false if undefined
  return !!isMobile
}
