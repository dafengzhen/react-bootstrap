import { useState } from 'react';

import type { ApiProp, RenderLink } from '../doc-template';
import type { DocConfig } from './types.ts';

import { DemoSection, DocTemplate } from '../doc-template';
import { DocsLayout } from './docs-layout.tsx';

const usageCode =
  '<DocsLayout\n  docs={docs}\n  navItems={navItems}\n  navTitle="React Bootstrap"\n  pathname={pathname}\n  renderLink={renderLink}\n>\n  {content}\n</DocsLayout>';
const sidebarTitleCode =
  '<DocsLayout docs={docs} sidebarTitle="组件" rightSidebarTitle="本页目录">\n  {content}\n</DocsLayout>';
const embeddedCode =
  '<DocsLayout docs={docs} embedded pathname="/button" renderLink={renderLink}>\n  {content}\n</DocsLayout>';
const controlledCode =
  '<DocsLayout docs={docs} embedded pathname={pathname} renderLink={renderLink}>\n  {content}\n</DocsLayout>';

const demoDocs: DocConfig[] = [
  { description: '按钮组件', element: <div />, name: 'Button', path: '/button', tags: ['基础'] },
  { description: '徽章组件', element: <div />, name: 'Badge', path: '/badge', tags: ['反馈'] },
];

const renderLink: RenderLink = ({ children, to }) => (
  <a href={to} onClick={(event) => event.preventDefault()}>
    {children}
  </a>
);

const docsLayoutProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '主内容区域（当前文档页内容）',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '文档配置列表（必填）',
    name: 'docs',
    type: 'DocConfig[]',
  },
  {
    defaultValue: 'false',
    description: '是否以内嵌模式渲染（不显示顶部导航与右侧目录，侧边栏不固定）',
    name: 'embedded',
    type: 'boolean',
  },
  {
    defaultValue: "'https://github.com/dafengzhen/react-bootstrap'",
    description: '页脚 GitHub 链接',
    name: 'githubUrl',
    type: 'string',
  },
  {
    defaultValue: '[]',
    description: '顶部导航项列表，非空时显示顶部导航栏',
    name: 'navItems',
    type: 'DocsNavItem[]',
  },
  {
    defaultValue: '-',
    description: '顶部导航栏品牌标题，传入后在导航栏左侧渲染品牌链接',
    name: 'navTitle',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '当前路由地址，用于高亮目录项与导航项',
    name: 'pathname',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '自定义链接渲染函数，用于接入路由库',
    name: 'renderLink',
    type: 'RenderLink',
  },
  {
    defaultValue: "'On This Page'",
    description: '右侧页面目录标题（当前文档页的组件选项）',
    name: 'rightSidebarTitle',
    type: 'string',
  },
  {
    defaultValue: "'Components'",
    description: '左侧组件目录标题',
    name: 'sidebarTitle',
    type: 'string',
  },
];

export const DocsLayoutDoc = () => {
  const [pathname, setPathname] = useState('/button');

  const demoContent = (
    <>
      <DemoSection code={usageCode} title="用法">
        <p className="mb-0">
          DocsLayout
          提供顶部导航栏、左侧组件目录、主内容区、右侧页面目录（当前文档页的组件选项）与页脚的统一布局，通过
          children 与 pathname 传入当前页面内容与地址。
        </p>
      </DemoSection>
      <DemoSection code={sidebarTitleCode} title="自定义目录标题">
        <p className="mb-0">通过 sidebarTitle 与 rightSidebarTitle 自定义左右目录标题。</p>
      </DemoSection>
      <DemoSection code={embeddedCode} title="内嵌布局">
        <DocsLayout
          docs={demoDocs}
          embedded
          pathname="/button"
          renderLink={renderLink}
          sidebarTitle="组件"
        >
          <p className="mb-0">
            这是内嵌在容器中的布局内容，不显示顶部导航与右侧目录，侧边栏不再固定为全屏高度。
          </p>
        </DocsLayout>
      </DemoSection>
      <DemoSection code={controlledCode} title="受控路由切换">
        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn btn-sm ${pathname === '/button' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setPathname('/button')}
            type="button"
          >
            Button
          </button>
          <button
            className={`btn btn-sm ${pathname === '/badge' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setPathname('/badge')}
            type="button"
          >
            Badge
          </button>
        </div>
        <DocsLayout
          docs={demoDocs}
          embedded
          pathname={pathname}
          renderLink={renderLink}
          sidebarTitle="组件"
        >
          <p className="mb-0">当前路由：{pathname}</p>
        </DocsLayout>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="文档站点布局组件，组合顶部导航、左侧组件目录、主内容区、右侧页面目录与页脚，不依赖特定路由库，并支持内嵌模式"
      componentName="DocsLayout"
      componentTags={['文档', '布局']}
      demoContent={demoContent}
      props={docsLayoutProps}
    />
  );
};

export default DocsLayoutDoc;
