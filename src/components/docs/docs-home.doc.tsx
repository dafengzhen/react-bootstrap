import { useState } from 'react';

import type { ApiProp, RenderLink } from '../doc-template';
import type { DocConfig } from './types.ts';

import { DemoSection, DocTemplate } from '../doc-template';
import { DocsHome } from './docs-home.tsx';

const demoDocs: DocConfig[] = [
  {
    description: '按钮组件',
    element: <div />,
    name: 'Button',
    path: '/components/button',
    tags: ['基础'],
  },
  {
    description: '徽章组件',
    element: <div />,
    name: 'Badge',
    path: '/components/badge',
    tags: ['反馈'],
  },
  {
    description: '卡片组件',
    element: <div />,
    name: 'Card',
    path: '/components/card',
    tags: ['布局'],
  },
];

const manyDocs: DocConfig[] = [
  {
    description: '按钮组件',
    element: <div />,
    name: 'Button',
    path: '/components/button',
    tags: ['基础', '表单'],
  },
  {
    description: '徽章组件',
    element: <div />,
    name: 'Badge',
    path: '/components/badge',
    tags: ['反馈'],
  },
  {
    description: '卡片组件',
    element: <div />,
    name: 'Card',
    path: '/components/card',
    tags: ['布局'],
  },
  {
    description: '弹窗组件',
    element: <div />,
    name: 'Modal',
    path: '/components/modal',
    tags: ['对话框'],
  },
  {
    description: '表格组件',
    element: <div />,
    name: 'Table',
    path: '/components/table',
    tags: ['布局', '数据'],
  },
  {
    description: '下拉菜单组件',
    element: <div />,
    name: 'Dropdown',
    path: '/components/dropdown',
    tags: ['导航'],
  },
];

const basicCode = '<DocsHome docs={docs} title="组件库" />';
const tagsCode = '<DocsHome docs={docs} title="组件库" />';
const searchCode =
  'const filtered = docs.filter((doc) => doc.name.includes(keyword));\n<DocsHome docs={filtered} title="组件库" />';
const editCode = '<DocsHome docs={dynamicDocs} title="组件库" />';

const docsHomeProps: ApiProp[] = [
  {
    defaultValue: "'欢迎使用组件库，以下是所有组件的文档'",
    description: '首页描述',
    name: 'description',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '文档配置列表（必填）',
    name: 'docs',
    type: 'DocConfig[]',
  },
  {
    defaultValue: '-',
    description: '自定义链接渲染函数，用于接入路由库',
    name: 'renderLink',
    type: 'RenderLink',
  },
  {
    defaultValue: "'React Bootstrap'",
    description: '标题',
    name: 'title',
    type: 'string',
  },
];

const renderLink: RenderLink = ({ children, className }) => (
  <span className={className}>{children}</span>
);

export const DocsHomeDoc = () => {
  const [keyword, setKeyword] = useState('');
  const [dynamicDocs, setDynamicDocs] = useState(demoDocs);
  const filteredDocs = demoDocs.filter((doc) =>
    doc.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <DocsHome docs={demoDocs} renderLink={renderLink} title="组件库" />
      </DemoSection>
      <DemoSection code={tagsCode} title="多卡片与标签">
        <DocsHome docs={manyDocs} renderLink={renderLink} title="组件库" />
      </DemoSection>
      <DemoSection code={searchCode} title="搜索筛选">
        <div className="mb-3" style={{ maxWidth: 360 }}>
          <input
            className="form-control"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入名称筛选（如 Button）"
            value={keyword}
          />
        </div>
        <DocsHome docs={filteredDocs} renderLink={renderLink} title="组件库" />
      </DemoSection>
      <DemoSection code={editCode} title="增删卡片">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              setDynamicDocs((prev) => [
                ...prev,
                {
                  description: '新增组件',
                  element: <div />,
                  name: `Component ${prev.length + 1}`,
                  path: `/components/component-${prev.length + 1}`,
                  tags: ['新增'],
                },
              ])
            }
            type="button"
          >
            新增卡片
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setDynamicDocs((prev) => prev.slice(0, -1))}
            type="button"
          >
            移除末尾
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setDynamicDocs(demoDocs)}
            type="button"
          >
            重置
          </button>
        </div>
        <DocsHome docs={dynamicDocs} renderLink={renderLink} title="组件库" />
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="文档首页组件，以卡片网格展示组件文档入口，链接渲染可定制"
      componentName="DocsHome"
      componentTags={['文档', '布局']}
      demoContent={demoContent}
      props={docsHomeProps}
    />
  );
};

export default DocsHomeDoc;
