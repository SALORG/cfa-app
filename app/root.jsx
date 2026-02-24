import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./app.css";

export const links = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg", media: "(prefers-color-scheme: dark)" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
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

  useEffect(() => {
    Clarity.init("vmfpx2w9es");
  }, []);

  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="facebook-domain-verification" content="j6fbfe5pribprydq04p3bds9aasm67" />
        <title>CFA Level I Study Dashboard</title>
        <Meta />
        <Links />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DDNB824TR0"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DDNB824TR0');` }} />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1922371825333446');fbq('track','PageView');` }} />
        <noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1922371825333446&ev=PageView&noscript=1" />` }} />
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
