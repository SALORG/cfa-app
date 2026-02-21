import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./app.css";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function InnerLayout({ children }) {
  const { isDark } = useTheme();
  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CFA Level I Study Dashboard</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-surface text-text-primary min-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <InnerLayout>{children}</InnerLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-bold text-danger">{message}</h1>
      <p className="mt-2 text-text-secondary">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto mt-4 bg-surface-secondary rounded-lg">
          <code className="text-sm">{stack}</code>
        </pre>
      )}
    </main>
  );
}
