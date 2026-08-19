import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import activeCode from './demos/active.md?raw';
import badgesCode from './demos/badges.md?raw';
import basicCode from './demos/basic.md?raw';
import checkboxesRadiosCode from './demos/checkboxes-radios.md?raw';
import customContentCode from './demos/custom-content.md?raw';
import disabledCode from './demos/disabled.md?raw';
import flushCode from './demos/flush.md?raw';
import horizontalCode from './demos/horizontal.md?raw';
import javascriptBehaviorCode from './demos/javascript-behavior.md?raw';
import linksButtonsCode from './demos/links-buttons.md?raw';
import numberedCode from './demos/numbered.md?raw';
import variantsCode from './demos/variants.md?raw';
import { ListGroup, ListGroupItem } from './index';
import listGroupHorizontalTypeCode from './types/list-group-horizontal.md?raw';
import listGroupItemPropsTypeCode from './types/list-group-item-props.md?raw';
import listGroupItemVariantTypeCode from './types/list-group-item-variant.md?raw';
import listGroupPropsTypeCode from './types/list-group-props.md?raw';

type TabKey = 'home' | 'messages' | 'profile' | 'settings';

const listGroupProps: ApiProp[] = [
  {
    component: 'ListGroup',
    defaultValue: "'ul'",
    description: '容器渲染的元素标签，可选 `ol`、`div` 等',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ListGroup',
    defaultValue: 'false',
    description: '去除外边框与圆角，渲染为 `list-group-flush` 类',
    name: 'flush',
    type: 'boolean',
  },
  {
    component: 'ListGroup',
    defaultValue: 'false',
    description:
      '水平布局，`true` 始终水平，或传入断点 `sm`、`md`、`lg`、`xl`、`xxl` 从该断点起水平',
    name: 'horizontal',
    type: 'ListGroupHorizontal | boolean',
  },
  {
    component: 'ListGroup',
    defaultValue: 'false',
    description: '编号列表，渲染为 `list-group-numbered` 类（配合 `as="ol"` 使用）',
    name: 'numbered',
    type: 'boolean',
  },
  {
    component: 'ListGroupItem',
    defaultValue: 'false',
    description: '可交互样式，渲染为 `list-group-item-action` 类，未设置 `href` 时渲染为 `button`',
    name: 'action',
    type: 'boolean',
  },
  {
    component: 'ListGroupItem',
    defaultValue: 'false',
    description: '激活状态，渲染 `active` 类并设置 `aria-current="true"`',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'ListGroupItem',
    defaultValue: "'li'",
    description:
      '渲染的元素标签，默认 `li`；设置 `href` 时默认为 `a`，设置 `action` 时默认为 `button`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ListGroupItem',
    defaultValue: 'false',
    description:
      '禁用状态，渲染 `disabled` 类并设置 `aria-disabled="true"`，渲染为 `button` 时同时设置原生 `disabled`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'ListGroupItem',
    defaultValue: '-',
    description: '链接地址，设置后渲染为 `a` 标签',
    name: 'href',
    type: 'string',
  },
  {
    component: 'ListGroupItem',
    defaultValue: "'button'",
    description: '渲染为 `button` 时的原生 type，默认为 button 以避免意外提交表单',
    name: 'type',
    type: "'button' | 'reset' | 'submit'",
  },
  {
    component: 'ListGroupItem',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `list-group-item-*` 类',
    name: 'variant',
    type: 'ListGroupItemVariant',
  },
  {
    defaultValue: '-',
    description: '列表内容',
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

const listGroupTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: listGroupHorizontalTypeCode,
    description: '列表组水平布局断点类型',
    name: 'ListGroupHorizontal',
  },
  {
    code: listGroupItemVariantTypeCode,
    description: '列表项情景颜色变体类型',
    name: 'ListGroupItemVariant',
  },
  {
    code: listGroupPropsTypeCode,
    description: '列表组容器组件属性接口',
    name: 'ListGroupProps',
  },
  {
    code: listGroupItemPropsTypeCode,
    description: '列表项组件属性接口',
    name: 'ListGroupItemProps',
  },
];

export const ListGroupDoc = () => {
  const [activeKey, setActiveKey] = useState<TabKey>('home');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <ListGroup style={{ maxWidth: '24rem' }}>
          <ListGroupItem>列表项 1</ListGroupItem>
          <ListGroupItem>列表项 2</ListGroupItem>
          <ListGroupItem>列表项 3</ListGroupItem>
          <ListGroupItem>列表项 4</ListGroupItem>
          <ListGroupItem>列表项 5</ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={activeCode} title="激活状态">
        <ListGroup style={{ maxWidth: '24rem' }}>
          <ListGroupItem active>激活的列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <ListGroup style={{ maxWidth: '24rem' }}>
          <ListGroupItem disabled>禁用的列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
          <ListGroupItem>普通列表项</ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={linksButtonsCode} title="链接与按钮">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <ListGroup as="div" style={{ width: '16rem' }}>
            <ListGroupItem action active href="#list-links">
              当前链接项
            </ListGroupItem>
            <ListGroupItem action href="#list-links">
              第二个链接项
            </ListGroupItem>
            <ListGroupItem action href="#list-links">
              第三个链接项
            </ListGroupItem>
            <ListGroupItem action disabled href="#list-links">
              禁用的链接项
            </ListGroupItem>
          </ListGroup>
          <ListGroup as="div" style={{ width: '16rem' }}>
            <ListGroupItem action active>
              当前按钮项
            </ListGroupItem>
            <ListGroupItem action>第二个按钮项</ListGroupItem>
            <ListGroupItem action>第三个按钮项</ListGroupItem>
            <ListGroupItem action disabled>
              禁用的按钮项
            </ListGroupItem>
          </ListGroup>
        </div>
      </DemoSection>

      <DemoSection code={flushCode} title="无边框">
        <ListGroup flush style={{ maxWidth: '24rem' }}>
          <ListGroupItem>列表项 1</ListGroupItem>
          <ListGroupItem>列表项 2</ListGroupItem>
          <ListGroupItem>列表项 3</ListGroupItem>
          <ListGroupItem>列表项 4</ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={numberedCode} title="编号列表">
        <ListGroup as="ol" numbered style={{ maxWidth: '24rem' }}>
          <ListGroupItem>列表项 1</ListGroupItem>
          <ListGroupItem>列表项 2</ListGroupItem>
          <ListGroupItem>列表项 3</ListGroupItem>
          <ListGroupItem>列表项 4</ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={horizontalCode} title="水平布局">
        <div className="d-flex flex-column gap-3">
          <ListGroup horizontal>
            <ListGroupItem>列表项 1</ListGroupItem>
            <ListGroupItem>列表项 2</ListGroupItem>
            <ListGroupItem>列表项 3</ListGroupItem>
          </ListGroup>
          <ListGroup horizontal="md">
            <ListGroupItem>列表项 1</ListGroupItem>
            <ListGroupItem>列表项 2</ListGroupItem>
            <ListGroupItem>列表项 3</ListGroupItem>
          </ListGroup>
        </div>
      </DemoSection>

      <DemoSection code={variantsCode} title="情景颜色">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <ListGroup>
            <ListGroupItem variant="primary">主要样式列表项</ListGroupItem>
            <ListGroupItem variant="secondary">次要样式列表项</ListGroupItem>
            <ListGroupItem variant="success">成功样式列表项</ListGroupItem>
            <ListGroupItem variant="danger">危险样式列表项</ListGroupItem>
            <ListGroupItem variant="warning">警告样式列表项</ListGroupItem>
            <ListGroupItem variant="info">信息样式列表项</ListGroupItem>
            <ListGroupItem variant="light">浅色样式列表项</ListGroupItem>
            <ListGroupItem variant="dark">深色样式列表项</ListGroupItem>
          </ListGroup>
          <ListGroup>
            <ListGroupItem action variant="primary">
              主要样式链接项
            </ListGroupItem>
            <ListGroupItem action variant="success">
              成功样式链接项
            </ListGroupItem>
            <ListGroupItem action variant="danger">
              危险样式链接项
            </ListGroupItem>
          </ListGroup>
        </div>
      </DemoSection>

      <DemoSection code={badgesCode} title="徽章">
        <ListGroup style={{ maxWidth: '24rem' }}>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            收件箱
            <span className="badge rounded-pill text-bg-primary">14</span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            已发送
            <span className="badge rounded-pill text-bg-secondary">2</span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            草稿箱
            <span className="badge rounded-pill text-bg-info">5</span>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between align-items-center">
            垃圾箱
            <span className="badge rounded-pill text-bg-danger">1</span>
          </ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={customContentCode} title="自定义内容">
        <ListGroup as="div" style={{ maxWidth: '32rem' }}>
          <ListGroupItem action active href="#custom-item-1">
            <div className="d-flex justify-content-between w-100">
              <h5 className="mb-1">列表组标题 1</h5>
              <small>3 天前</small>
            </div>
            <p className="mb-1">这是一段用于占位的段落内容。</p>
            <small>以及一些次要说明文字。</small>
          </ListGroupItem>
          <ListGroupItem action href="#custom-item-2">
            <div className="d-flex justify-content-between w-100">
              <h5 className="mb-1">列表组标题 2</h5>
              <small className="text-body-secondary">2 天前</small>
            </div>
            <p className="mb-1">这是一段用于占位的段落内容。</p>
            <small className="text-body-secondary">以及一些次要说明文字。</small>
          </ListGroupItem>
          <ListGroupItem action href="#custom-item-3">
            <div className="d-flex justify-content-between w-100">
              <h5 className="mb-1">列表组标题 3</h5>
              <small className="text-body-secondary">1 天前</small>
            </div>
            <p className="mb-1">这是一段用于占位的段落内容。</p>
            <small className="text-body-secondary">以及一些次要说明文字。</small>
          </ListGroupItem>
        </ListGroup>
      </DemoSection>

      <DemoSection code={checkboxesRadiosCode} title="复选框与单选框">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <ListGroup style={{ width: '16rem' }}>
            <ListGroupItem>
              <input className="form-check-input me-1" id="list-check-1" type="checkbox" />
              <label className="form-check-label" htmlFor="list-check-1">
                复选框 1
              </label>
            </ListGroupItem>
            <ListGroupItem>
              <input className="form-check-input me-1" id="list-check-2" type="checkbox" />
              <label className="form-check-label" htmlFor="list-check-2">
                复选框 2
              </label>
            </ListGroupItem>
            <ListGroupItem>
              <input className="form-check-input me-1" id="list-check-3" type="checkbox" />
              <label className="form-check-label" htmlFor="list-check-3">
                复选框 3
              </label>
            </ListGroupItem>
          </ListGroup>
          <ListGroup style={{ width: '16rem' }}>
            <ListGroupItem>
              <input
                className="form-check-input me-1"
                id="list-radio-1"
                name="listGroupRadio"
                type="radio"
              />
              <label className="form-check-label" htmlFor="list-radio-1">
                单选框 1
              </label>
            </ListGroupItem>
            <ListGroupItem>
              <input
                className="form-check-input me-1"
                id="list-radio-2"
                name="listGroupRadio"
                type="radio"
              />
              <label className="form-check-label" htmlFor="list-radio-2">
                单选框 2
              </label>
            </ListGroupItem>
            <ListGroupItem>
              <input
                className="form-check-input me-1"
                id="list-radio-3"
                name="listGroupRadio"
                type="radio"
              />
              <label className="form-check-label" htmlFor="list-radio-3">
                单选框 3
              </label>
            </ListGroupItem>
          </ListGroup>
        </div>
      </DemoSection>

      <DemoSection code={javascriptBehaviorCode} title="JavaScript 行为">
        <div className="row">
          <div className="col-4">
            <ListGroup as="div">
              <ListGroupItem
                action
                active={activeKey === 'home'}
                onClick={() => setActiveKey('home')}
              >
                首页
              </ListGroupItem>
              <ListGroupItem
                action
                active={activeKey === 'profile'}
                onClick={() => setActiveKey('profile')}
              >
                个人资料
              </ListGroupItem>
              <ListGroupItem
                action
                active={activeKey === 'messages'}
                onClick={() => setActiveKey('messages')}
              >
                消息
              </ListGroupItem>
              <ListGroupItem
                action
                active={activeKey === 'settings'}
                onClick={() => setActiveKey('settings')}
              >
                设置
              </ListGroupItem>
            </ListGroup>
          </div>
          <div className="col-8">
            <div className="tab-content">
              {activeKey === 'home' && (
                <div className="fade show tab-pane active" role="tabpanel">
                  首页内容，这里是第一个选项卡的面板。
                </div>
              )}
              {activeKey === 'profile' && (
                <div className="fade show tab-pane active" role="tabpanel">
                  个人资料内容，这里是第二个选项卡的面板。
                </div>
              )}
              {activeKey === 'messages' && (
                <div className="fade show tab-pane active" role="tabpanel">
                  消息内容，这里是第三个选项卡的面板。
                </div>
              )}
              {activeKey === 'settings' && (
                <div className="fade show tab-pane active" role="tabpanel">
                  设置内容，这里是第四个选项卡的面板。
                </div>
              )}
            </div>
          </div>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的列表组组件，提供灵活且强大的内容列表容器，支持激活/禁用状态、链接与按钮、无边框与编号样式、水平布局、情景颜色、徽章与自定义内容"
      componentName="ListGroup"
      componentTags={['基础', '导航']}
      demoContent={demoContent}
      props={listGroupProps}
      typeDefinitions={listGroupTypeDefinitions}
    />
  );
};

export default ListGroupDoc;
