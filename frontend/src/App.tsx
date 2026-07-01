import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { RealtimeProvider } from './services/realtime/RealtimeProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <RealtimeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </RealtimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
