import type { ReactNode } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import { Analytics } from '@vercel/analytics/react';
import 'highlight.js/styles/github-dark.css';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './main.css';
import { CodeBlockHighlightContext } from './components/doc-template';
import { highlightElement } from './highlight';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
        <meta content="#0d6efd" name="theme-color" />
        <link href="/site.webmanifest" rel="manifest" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <CodeBlockHighlightContext.Provider value={highlightElement}>
      <Outlet />
    </CodeBlockHighlightContext.Provider>
  );
}
