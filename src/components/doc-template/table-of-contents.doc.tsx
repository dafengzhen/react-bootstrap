import { useState } from 'react';

import type { ApiProp, RenderLink, TocItem } from './types.ts';

import { DemoSection } from './demo-section.tsx';
import { DocTemplate } from './doc-template.tsx';
import { TableOfContents } from './table-of-contents.tsx';

const tocItems: TocItem[] = [
  { id: 'toc-demo-overview', level: 1, title: '组件示例' },
  { id: 'toc-basic', level: 2, title: '基础用法' },
  { id: 'toc-api', level: 1, title: 'API 文档' },
  { id: 'toc-props', level: 2, title: 'Props' },
  { id: 'toc-types', level: 2, title: '类型定义' },
];

const linkItems: TocItem[] = [
  { id: 'toc-link-home', level: 1, title: '首页', to: '/' },
  { id: 'toc-link-button', level: 1, title: 'Button', to: '/button' },
  { id: 'toc-link-badge', level: 1, title: 'Badge', to: '/badge' },
];

const basicCode = '<TableOfContents items={tocItems} />';
const linkCode = '<TableOfContents activeTo="/button" items={linkItems} renderLink={renderLink} />';
const controlledCode =
  '<TableOfContents activeTo={activeTo} items={linkItems} renderLink={renderLink} />';

const tableOfContentsProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '当前激活的路由地址，用于高亮对应的链接项',
    name: 'activeTo',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '目录项列表（必填）',
    name: 'items',
    type: 'TocItem[]',
  },
  {
    defaultValue: '-',
    description: '点击锚点或链接项后的回调',
    name: 'onNavigate',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '自定义链接渲染函数，用于接入路由库',
    name: 'renderLink',
    type: 'RenderLink',
  },
  {
    defaultValue: "'目录'",
    description: '目录标题',
    name: 'title',
    type: 'string',
  },
];

const renderLink: RenderLink = ({ children, to }) => (
  <a href={to} onClick={(event) => event.preventDefault()}>
    {children}
  </a>
);

export const TableOfContentsDoc = () => {
  const [activeTo, setActiveTo] = useState('/button');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div style={{ maxWidth: 320 }}>
          <TableOfContents items={tocItems} />
        </div>
      </DemoSection>
      <DemoSection code={linkCode} title="链接项与激活态">
        <div style={{ maxWidth: 320 }}>
          <TableOfContents activeTo="/button" items={linkItems} renderLink={renderLink} />
        </div>
      </DemoSection>
      <DemoSection code={controlledCode} title="受控激活">
        <div className="d-flex gap-2 mb-2">
          <button
            className={`btn btn-sm ${activeTo === '/' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTo('/')}
            type="button"
          >
            首页
          </button>
          <button
            className={`btn btn-sm ${activeTo === '/button' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTo('/button')}
            type="button"
          >
            Button
          </button>
          <button
            className={`btn btn-sm ${activeTo === '/badge' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTo('/badge')}
            type="button"
          >
            Badge
          </button>
        </div>
        <div style={{ maxWidth: 320 }}>
          <TableOfContents activeTo={activeTo} items={linkItems} renderLink={renderLink} />
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="目录组件，渲染可折叠的分级目录，支持锚点跳转与自定义链接渲染"
      componentName="TableOfContents"
      componentTags={['文档']}
      demoContent={demoContent}
      props={tableOfContentsProps}
    />
  );
};

export default TableOfContentsDoc;
