import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import activeCode from './demos/active.md?raw';
import alignmentCode from './demos/alignment.md?raw';
import basicCode from './demos/basic.md?raw';
import disabledCode from './demos/disabled.md?raw';
import iconsCode from './demos/icons.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import sizingCode from './demos/sizing.md?raw';
import { Pagination, PaginationItem, PaginationLink } from './index';
import paginationAlignTypeCode from './types/pagination-align.md?raw';
import paginationItemPropsTypeCode from './types/pagination-item-props.md?raw';
import paginationLinkPropsTypeCode from './types/pagination-link-props.md?raw';
import paginationPropsTypeCode from './types/pagination-props.md?raw';
import paginationSizeTypeCode from './types/pagination-size.md?raw';

const paginationProps: ApiProp[] = [
  {
    component: 'Pagination',
    defaultValue: '-',
    description:
      '对齐方式，`center` 渲染 `justify-content-center`，`end` 渲染 `justify-content-end` flex 工具类',
    name: 'align',
    type: 'PaginationAlign',
  },
  {
    component: 'Pagination',
    defaultValue: "'nav'",
    description: '根元素标签，默认渲染 `nav` 并自动设置无障碍标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Pagination',
    defaultValue: "'pagination'",
    description: '根元素的 `aria-label` 无障碍标签，用于描述分页导航的用途',
    name: 'label',
    type: 'string',
  },
  {
    component: 'Pagination',
    defaultValue: "'ul'",
    description: '列表容器元素标签，对应渲染 `pagination` 类的元素',
    name: 'listAs',
    type: 'ElementType',
  },
  {
    component: 'Pagination',
    defaultValue: '-',
    description: '透传给列表容器（默认 `ul`）的原生属性',
    name: 'listProps',
    type: 'HTMLAttributes<HTMLElement>',
  },
  {
    component: 'Pagination',
    defaultValue: '-',
    description: '分页尺寸，`lg`/`sm` 分别渲染 `pagination-lg`/`pagination-sm` 类',
    name: 'size',
    type: 'PaginationSize',
  },
  {
    component: 'PaginationItem',
    defaultValue: 'false',
    description: '激活状态，渲染 `active` 类并设置 `aria-current="page"`',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'PaginationItem',
    defaultValue: "'li'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'PaginationItem',
    defaultValue: 'false',
    description: '禁用状态，渲染 `disabled` 类并设置 `aria-disabled="true"`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'PaginationLink',
    defaultValue: 'false',
    description: '激活状态，渲染为不可交互的 `span` 以替换链接元素',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'PaginationLink',
    defaultValue: "'a'",
    description: '渲染的元素标签，激活、禁用或未设置 `href` 时默认渲染为 `span`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'PaginationLink',
    defaultValue: 'false',
    description:
      '禁用状态，默认渲染为 `span`；显式 `as="a"` 时同时设置 `tabIndex={-1}` 与 `aria-disabled="true"`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'PaginationLink',
    defaultValue: '-',
    description: '链接地址，设置后渲染为 `a` 标签',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '分页内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '自定义类名',
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

const paginationTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: paginationAlignTypeCode,
    description: '分页对齐方式类型',
    name: 'PaginationAlign',
  },
  {
    code: paginationItemPropsTypeCode,
    description: '分页条目组件属性接口',
    name: 'PaginationItemProps',
  },
  {
    code: paginationLinkPropsTypeCode,
    description: '分页链接组件属性接口',
    name: 'PaginationLinkProps',
  },
  {
    code: paginationPropsTypeCode,
    description: '分页容器组件属性接口',
    name: 'PaginationProps',
  },
  {
    code: paginationSizeTypeCode,
    description: '分页尺寸类型',
    name: 'PaginationSize',
  },
];

export const PaginationDoc = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <Pagination>
          <PaginationItem>
            <PaginationLink href="#">上一页</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 text-muted small">
          Pagination 渲染 `nav` + `ul.pagination` 结构，每个条目由
          PaginationItem（`li.page-item`）与
          PaginationLink（`a.page-link`）组合而成，方便屏幕阅读器播报可用链接数量
        </p>
      </DemoSection>

      <DemoSection code={iconsCode} title="图标链接">
        <Pagination>
          <PaginationItem>
            <PaginationLink aria-label="上一页" href="#">
              <span aria-hidden="true">&laquo;</span>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink aria-label="下一页" href="#">
              <span aria-hidden="true">&raquo;</span>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 text-muted small">
          使用图标或符号代替文字时，应为链接提供 `aria-label`，并为装饰性图标设置
          `aria-hidden="true"`
        </p>
      </DemoSection>

      <DemoSection code={activeCode} title="激活状态">
        <Pagination>
          <PaginationItem>
            <PaginationLink href="#">上一页</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem active>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
        <Pagination className="mb-0" label="图标激活示例">
          <PaginationItem active>
            <PaginationLink active>
              <span aria-hidden="true">&laquo;</span>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink aria-label="下一页" href="#">
              <span aria-hidden="true">&raquo;</span>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 mt-3 text-muted small">
          PaginationItem 的 active 渲染 `active` 类并设置 `aria-current="page"`；PaginationLink 的
          active 将链接替换为不可交互的 `span`
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <Pagination>
          <PaginationItem disabled>
            <PaginationLink>上一页</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem active>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
        <Pagination className="mb-0" label="链接禁用示例">
          <PaginationItem>
            <PaginationLink disabled href="#">
              上一页
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 mt-3 text-muted small">
          PaginationItem 的 disabled 渲染 `disabled` 类并设置 `aria-disabled="true"`；PaginationLink
          的 disabled 默认将链接替换为不可聚焦的 `span`，避免键盘与鼠标误操作
        </p>
      </DemoSection>

      <DemoSection code={sizingCode} title="尺寸">
        <Pagination label="默认尺寸分页">
          <PaginationItem active>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
        </Pagination>
        <Pagination label="大尺寸分页" size="lg">
          <PaginationItem active>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
        </Pagination>
        <Pagination className="mb-0" label="小尺寸分页" size="sm">
          <PaginationItem active>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 mt-3 text-muted small">
          size 属性分别渲染 `pagination-lg` 与 `pagination-sm` 类，提供更大或更小的分页尺寸
        </p>
      </DemoSection>

      <DemoSection code={alignmentCode} title="对齐">
        <Pagination align="center" label="居中对齐分页">
          <PaginationItem disabled>
            <PaginationLink>上一页</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem active>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
        <Pagination align="end" className="mb-0" label="右对齐分页">
          <PaginationItem disabled>
            <PaginationLink>上一页</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem active>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">下一页</PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 mt-3 text-muted small">
          align 对应 flexbox 工具类 `justify-content-center`/`justify-content-end`，也可通过
          listProps 传入任意 `justify-content-*` 类实现更多对齐方式
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互示例">
        <Pagination label="分页交互示例">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
            >
              上一页
            </PaginationLink>
          </PaginationItem>
          {pages.map((page) => (
            <PaginationItem active={currentPage === page} key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem disabled={currentPage === pages.length}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.min(pages.length, p + 1));
              }}
            >
              下一页
            </PaginationLink>
          </PaginationItem>
        </Pagination>
        <p className="mb-0 mt-3 text-muted small">
          通过 state 控制 active 与 disabled 属性即可实现受控分页，当前页：{currentPage} /{' '}
          {pages.length}
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的分页组件，用于将大量内容拆分到多个页面并提供跳转导航，支持图标链接、激活/禁用状态、尺寸调整、对齐方式与无障碍标签"
      componentName="Pagination"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={paginationProps}
      typeDefinitions={paginationTypeDefinitions}
    />
  );
};

export default PaginationDoc;
