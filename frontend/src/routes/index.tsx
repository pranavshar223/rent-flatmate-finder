import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LandingPage } from '../features/landing/pages/LandingPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RoleSelectionPage } from '../features/auth/pages/RoleSelectionPage'
import { ProtectedRoute } from '../components/guards/ProtectedRoute'
import { RoleRoute } from '../components/guards/RoleRoute'
import { DesignSystemPage } from '../features/dev/pages/DesignSystemPage'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { ownerMenu, tenantMenu, adminMenu } from '../config/navigation'

import { DashboardPage as OwnerDashboardPage } from '../features/owner/pages/DashboardPage'
import { MyRoomsPage } from '../features/owner/pages/MyRoomsPage'
import { CreateRoomPage } from '../features/owner/pages/CreateRoomPage'
import { RoomDetailsPage } from '../features/owner/pages/RoomDetailsPage'
import { EditRoomPage } from '../features/owner/pages/EditRoomPage'
import { RequestsPage } from '../features/owner/pages/RequestsPage'
import { ChatsPage } from '../features/owner/pages/ChatsPage'

import { DashboardPage as TenantDashboardPage } from '../features/tenant/pages/DashboardPage'
import { BrowseRoomsPage } from '../features/tenant/pages/BrowseRoomsPage'
import { RoomDetailsPage as TenantRoomDetailsPage } from '../features/tenant/pages/RoomDetailsPage'
import { RequestsPage as TenantRequestsPage } from '../features/tenant/pages/RequestsPage'
import { ChatsPage as TenantChatsPage } from '../features/tenant/pages/ChatsPage'
import { ProfilePage } from '../features/tenant/pages/ProfilePage'

import { OverviewPage } from '../features/admin/pages/OverviewPage'
import { UsersManagementPage } from '../features/admin/pages/UsersManagementPage'
import { RoomModerationPage } from '../features/admin/pages/RoomModerationPage'
import { AnalyticsPage } from '../features/admin/pages/AnalyticsPage'
import { AuditLogsPage } from '../features/admin/pages/AuditLogsPage'
import { SettingsPage } from '../features/admin/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/dev/design-system',
    element: <DesignSystemPage />
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'role-selection',
        element: (
          <ProtectedRoute>
            <RoleSelectionPage />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/owner',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['owner']}>
          <DashboardLayout sidebarMenuItems={ownerMenu}>
            <Outlet />
          </DashboardLayout>
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <OwnerDashboardPage /> },
      { path: 'rooms', element: <MyRoomsPage /> },
      { path: 'rooms/create', element: <CreateRoomPage /> },
      { path: 'rooms/:id', element: <RoomDetailsPage /> },
      { path: 'rooms/:id/edit', element: <EditRoomPage /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: 'chats', element: <ChatsPage /> },
    ]
  },
  {
    path: '/tenant',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['tenant']}>
          <DashboardLayout sidebarMenuItems={tenantMenu}>
            <Outlet />
          </DashboardLayout>
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <TenantDashboardPage /> },
      { path: 'rooms', element: <BrowseRoomsPage /> },
      { path: 'rooms/:id', element: <TenantRoomDetailsPage /> },
      { path: 'requests', element: <TenantRequestsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'chats', element: <TenantChatsPage /> },
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['admin']}>
          <DashboardLayout sidebarMenuItems={adminMenu}>
            <Outlet />
          </DashboardLayout>
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <OverviewPage /> },
      { path: 'users', element: <UsersManagementPage /> },
      { path: 'rooms', element: <RoomModerationPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'audit', element: <AuditLogsPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
])
