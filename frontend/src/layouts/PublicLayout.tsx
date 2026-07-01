import { Outlet, Link } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold text-primary">Rent & Flatmate</Link>
        </div>
        <nav>
          <Link to="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            Sign In
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Rent & Flatmate Finder. All rights reserved.</p>
      </footer>
    </div>
  )
}
