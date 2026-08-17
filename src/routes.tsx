import type { RouteObject } from 'react-router';

import ButtonGroupDoc from './components/button-group/button-group.doc';
import ButtonDoc from './components/button/button.doc';
import { type DocConfig, DocsHome, DocsLayout } from './components/docs';

const GITHUB_URL = 'https://github.com/dafengzhen/react-bootstrap';

const docsConfig: DocConfig[] = [
  {
    description: '通用按钮组件，支持多种变体、尺寸和状态',
    element: <ButtonDoc />,
    name: 'Button',
    order: 1,
    path: '/components/button',
    tags: ['基础', '表单'],
  },
  {
    description: '按钮组组件，将多个按钮组合为一个整体，支持水平/垂直排列与统一尺寸',
    element: <ButtonGroupDoc />,
    name: 'ButtonGroup',
    order: 2,
    path: '/components/button-group',
    tags: ['基础', '布局'],
  },
];

const HOME_DESCRIPTION = '基于 Bootstrap 5 的 React 组件库，以下是所有组件的文档和使用指南';
const HOME_TITLE = 'React Bootstrap';

const appRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <DocsHome description={HOME_DESCRIPTION} docs={docsConfig} title={HOME_TITLE} />,
        index: true,
      },
      ...docsConfig.map((doc): RouteObject => ({ element: doc.element, path: doc.path.slice(1) })),
    ],
    element: <DocsLayout docs={docsConfig} githubUrl={GITHUB_URL} />,
    path: '/',
  },
];

export default appRoutes;
