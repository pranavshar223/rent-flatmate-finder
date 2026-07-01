import { Link, useLocation } from 'react-router-dom';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-foreground">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          return (
            <li key={to}>
              <div className="flex items-center">
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {last ? (
                  <span className="ml-1 text-foreground font-medium md:ml-2 capitalize">
                    {value.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link to={to} className="ml-1 hover:text-foreground md:ml-2 capitalize">
                    {value.replace(/-/g, ' ')}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
