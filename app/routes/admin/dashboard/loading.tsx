import { AnimatedLoader } from "~/components/animated-loader"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      <AnimatedLoader message="Loading admin dashboard..." />
    </div>
  )
}
