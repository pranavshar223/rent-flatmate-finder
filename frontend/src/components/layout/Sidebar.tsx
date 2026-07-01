import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
// import { Button } from '../ui/button';

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
  badgeCount?: number;
}

interface SidebarProps {
  menuItems: MenuItem[];
  onClose?: () => void;
}

export const Sidebar = ({ menuItems, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">R&F</Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground p-2">
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span className={cn("flex-shrink-0 w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className={cn(
                    "ml-auto inline-block py-0.5 px-2 text-xs font-semibold rounded-full",
                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};
