import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"

export function Layout(): JSX.Element {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-4 pb-20 md:pb-4">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
