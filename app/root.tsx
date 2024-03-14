import { Links, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <Links />
      </head>
      <body>
        <div className="p-4">
          <h1 className="text-4xl font-bold mb-4">
            <a href="/">Todo</a>
          </h1>
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
