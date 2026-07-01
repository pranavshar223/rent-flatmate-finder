import { Outlet, Link } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <Link to="/" className="mb-8 text-2xl font-bold text-primary">
        Rent & Flatmate
      </Link>
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-sm border border-border">
        <Outlet />
      </div>
    </div>
  )
}
