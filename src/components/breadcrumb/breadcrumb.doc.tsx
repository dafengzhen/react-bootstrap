import { type CSSProperties } from 'react';
import { Link } from 'react-router';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import customStructureCode from './demos/custom-structure.md?raw';
import dividersCode from './demos/dividers.md?raw';
import linksCode from './demos/links.md?raw';
import routerCode from './demos/router.md?raw';
import { Breadcrumb, BreadcrumbItem } from './index';
import breadcrumbItemPropsTypeCode from './types/breadcrumb-item-props.md?raw';
import breadcrumbPropsTypeCode from './types/breadcrumb-props.md?raw';

const breadcrumbProps: ApiProp[] = [
  {
    defaultValue: "'nav'",
    description: 'Breadcrumb：根元素标签，默认渲染 `nav` 并自动设置无障碍标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description:
      'Breadcrumb：自定义分隔符，自动写入 `--bs-breadcrumb-divider` CSS 变量，替换默认的 `/`',
    name: 'divider',
    type: 'string',
  },
  {
    defaultValue: "'breadcrumb'",
    description: 'Breadcrumb：根元素的 `aria-label` 无障碍标签，用于描述导航类型',
    name: 'label',
    type: 'string',
  },
  {
    defaultValue: "'ol'",
    description: 'Breadcrumb：列表容器元素标签，对应渲染 `breadcrumb` 类的元素',
    name: 'listAs',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: 'Breadcrumb：透传给列表容器（默认 `ol`）的原生属性',
    name: 'listProps',
    type: 'OlHTMLAttributes<HTMLOListElement>',
  },
  {
    defaultValue: 'false',
    description:
      'BreadcrumbItem：激活状态，渲染 `active` 类并设置 `aria-current="page"`，同时忽略 `href` 渲染为纯文本',
    name: 'active',
    type: 'boolean',
  },
  {
    defaultValue: "'li'",
    description: 'BreadcrumbItem：渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: 'BreadcrumbItem：链接地址，非激活状态下在内部渲染 `a` 标签',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '所有组件：面包屑内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '所有组件：自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '透传原生元素属性（如 `onClick`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const breadcrumbTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: breadcrumbItemPropsTypeCode,
    description: '面包屑条目组件属性接口',
    name: 'BreadcrumbItemProps',
  },
  {
    code: breadcrumbPropsTypeCode,
    description: '面包屑容器组件属性接口',
    name: 'BreadcrumbProps',
  },
];

export const BreadcrumbDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Breadcrumb>
          <BreadcrumbItem active>首页</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem active>组件</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb className="mb-0">
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem href="#">组件</BreadcrumbItem>
          <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
        </Breadcrumb>
        <p className="mb-0 mt-3 text-muted small">
          条目之间的分隔符由 Bootstrap CSS 自动添加，无需手写分隔元素；最后一个条目通常使用 active
          标记当前页面
        </p>
      </DemoSection>

      <DemoSection code={linksCode} title="链接用法">
        <Breadcrumb>
          <BreadcrumbItem href="https://getbootstrap.com/docs/5.3/components/breadcrumb/">
            Bootstrap 面包屑文档
          </BreadcrumbItem>
          <BreadcrumbItem href="https://react.dev/">React 官方文档</BreadcrumbItem>
          <BreadcrumbItem active>当前页面</BreadcrumbItem>
        </Breadcrumb>
        <p className="mb-0 mt-3 text-muted small">
          设置 href 时条目内部渲染 a 链接；active 条目渲染为纯文本并设置 aria-current="page"
        </p>
      </DemoSection>

      <DemoSection code={dividersCode} title="自定义分隔符">
        <Breadcrumb divider=">">
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem href="#">组件</BreadcrumbItem>
          <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb divider="→">
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem active>组件</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb
          className="mb-0"
          style={
            {
              '--bs-breadcrumb-divider':
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")",
            } as CSSProperties
          }
        >
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem active>组件</BreadcrumbItem>
        </Breadcrumb>
        <p className="mb-0 mt-3 text-muted small">
          divider 会自动写入 --bs-breadcrumb-divider CSS 变量；需要 SVG 图标等复杂分隔符时，可通过
          style 直接设置该变量
        </p>
      </DemoSection>

      <DemoSection code={routerCode} title="路由集成">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">首页</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/components/list-group">ListGroup</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
        </Breadcrumb>
        <p className="mb-0 mt-3 text-muted small">
          使用 react-router 等路由库时，可直接将 Link 作为条目内容，点击后使用客户端路由跳转
        </p>
      </DemoSection>

      <DemoSection code={customStructureCode} title="自定义结构与标签">
        <Breadcrumb label="当前位置" listAs="ul">
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem href="#">产品</BreadcrumbItem>
          <BreadcrumbItem active>详情</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb className="mb-0" label="页面导航">
          <BreadcrumbItem href="#">组件库</BreadcrumbItem>
          <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
        </Breadcrumb>
        <p className="mb-0 mt-3 text-muted small">
          label 设置导航的无障碍名称，listAs 可替换列表容器元素（默认 ol）
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的面包屑组件，用于指示当前页面在导航层级中的位置，支持链接、激活状态、自定义分隔符与无障碍标签"
      componentName="Breadcrumb"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={breadcrumbProps}
      typeDefinitions={breadcrumbTypeDefinitions}
    />
  );
};

export default BreadcrumbDoc;
