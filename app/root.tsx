import * as React from 'react';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from 'remix';
import type { LinksFunction } from 'remix';
import styles from './tailwind.css';
import customStyles from './styles/custom.css';
import Player from './components/Player';
import { PlayerProvider } from './components/PlayerContext';
import Nprogress from 'nprogress';

/**
 * The `links` export is a function that returns an array of objects that map to
 * the attributes for an HTML `<link>` element. These will load `<link>` tags on
 * every route in the app, but individual routes can include their own links
 * that are automatically unloaded when a user navigates away from the route.
 *
 * https://remix.run/api/app#links
 */
export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
    {
      rel: 'stylesheet',
      href: customStyles,
    },
  ];
};

/**
 * The root module's default export is a component that renders the current
 * route via the `<Outlet />` component. Think of this as the global layout
 * component for your app.
 */
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <PlayerProvider>
      <html lang="en" className="h-full">
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1"
          />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
        </head>
        <body className="h-full">
          {children}
          <RouteChangeAnnouncement />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === 'development' && <LiveReload />}
        </body>
      </html>
    </PlayerProvider>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{ backgroundColor: '#191A19' }}
      className="flex flex-col min-h-full"
    >
      <div className="container flex-grow flex-shrink-0">
        <header className="flex items-center justify-between">
          <Link to="/">
            <img
              className="w-24 -ml-6"
              src="/mic-front-gradient.png"
              alt="mic"
            />
          </Link>
          <nav>
            <ul className="flex text-white capitalize ">
              <li>
                <Link
                  className="bg-gradient-to-r from-red-900 to-blue-600 px-4 py-2 rounded-full"
                  to="/podcasts"
                >
                  podcasts
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="mt-12">{children}</main>
        <div>
          <Player />
        </div>
      </div>
      <footer className="text-white p-4 mt-16 text-center bg-gradient-to-r from-red-900 to-blue-600 flex-shrink-0">
        <span>&#169;</span> Pody {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p className="text-white text-2xl">
          Oops! Looks like you tried to visit a page that you do not
          have access to.
        </p>
      );
      break;
    case 404:
      message = (
        <p className="text-white text-2xl">
          Oops! Looks like you tried to visit a page that does not
          exist.
        </p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <div className="flex items-center justify-center flex-col h-full">
          <div className=" gradient_text bg-gradient-to-r from-indigo-200 to-pink-600">
            <h1 className="text-6xl font-bold uppercase">
              {caught.status}: {caught.statusText}
            </h1>
          </div>
          {message}
        </div>
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Layout>
        <div className=" flex items-center justify-center">
          <div className="p-8 rounded-md max-w-md bg-gradient-to-r from-red-600 to-blue-600 text-center">
            <h1 className="text-white text-3xl font-bold tracking-tighter mb-4">
              Something went wrong
            </h1>
            <p className="text-white text-xs mb-4">{error.message}</p>
            <p className="text-white text-xs">
              We are working to solve the problem as quickly as
              possible. In the mean time try to refresh your browser.
            </p>
          </div>
        </div>
      </Layout>
    </Document>
  );
}

/**
 * Provides an alert for screen reader users when the route changes.
 */
const RouteChangeAnnouncement = React.memo(() => {
  const [hydrated, setHydrated] = React.useState(false);
  const [innerHtml, setInnerHtml] = React.useState('');
  const location = useLocation();

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    // Skip the first render because we don't want an announcement on the
    // initial page load.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    Nprogress.start();
    const pageTitle =
      location.pathname === '/' ? 'Home page' : document.title;
    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [location.pathname]);

  React.useEffect(() => {
    if (innerHtml) Nprogress.done();
  }, [innerHtml, location.pathname]);

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: '0',
        clipPath: 'inset(100%)',
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {innerHtml}
    </div>
  );
});

RouteChangeAnnouncement.displayName = 'RouteChangeAnnouncement';
