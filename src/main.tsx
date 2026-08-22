import { Analytics } from '@vercel/analytics/react';
import hljs from 'highlight.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'highlight.js/styles/github-dark.css';

import './main.css';
import { CodeBlockHighlightContext } from './components/doc-template';
import appRoutes from './routes';

const highlightElement = (element: HTMLElement) => hljs.highlightElement(element);

const router = createBrowserRouter(appRoutes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CodeBlockHighlightContext.Provider value={highlightElement}>
      <RouterProvider router={router} />
    </CodeBlockHighlightContext.Provider>
    <Analytics />
  </StrictMode>,
);
