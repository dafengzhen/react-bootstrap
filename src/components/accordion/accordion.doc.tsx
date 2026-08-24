import { type ReactNode, useState } from 'react';

import { Badge } from '../badge';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import alwaysOpenCode from './demos/always-open.md?raw';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customCode from './demos/custom.md?raw';
import flushCode from './demos/flush.md?raw';
import {
  Accordion,
  AccordionBody,
  AccordionCollapse,
  AccordionHeader,
  AccordionItem,
  useAccordionButton,
} from './index';
import accordionBodyPropsTypeCode from './types/accordion-body-props.md?raw';
import accordionButtonHandlePropsTypeCode from './types/accordion-button-handle-props.md?raw';
import accordionButtonPropsTypeCode from './types/accordion-button-props.md?raw';
import accordionCollapsePropsTypeCode from './types/accordion-collapse-props.md?raw';
import accordionContextValueTypeCode from './types/accordion-context-value.md?raw';
import accordionEventKeyTypeCode from './types/accordion-event-key.md?raw';
import accordionHeaderPropsTypeCode from './types/accordion-header-props.md?raw';
import accordionItemContextValueTypeCode from './types/accordion-item-context-value.md?raw';
import accordionItemPropsTypeCode from './types/accordion-item-props.md?raw';
import accordionPropsTypeCode from './types/accordion-props.md?raw';
import accordionSelectCallbackTypeCode from './types/accordion-select-callback.md?raw';

const accordionProps: ApiProp[] = [
  {
    component: 'Accordion',
    defaultValue: '-',
    description:
      '受控激活 key，传入单个 key 或 key 数组（配合 alwaysOpen）后展开状态完全由外部控制，需配合 onSelect 更新',
    name: 'activeKey',
    type: 'AccordionEventKey | AccordionEventKey[]',
  },
  {
    component: 'Accordion',
    defaultValue: '-',
    description: '非受控模式下的初始激活 key，单个 key 或 key 数组',
    name: 'defaultActiveKey',
    type: 'AccordionEventKey | AccordionEventKey[]',
  },
  {
    component: 'Accordion',
    defaultValue: 'false',
    description: '允许多个条目同时展开，点击已展开的条目仅折叠自身',
    name: 'alwaysOpen',
    type: 'boolean',
  },
  {
    component: 'Accordion',
    defaultValue: 'false',
    description: '渲染 `accordion-flush` 类，移除外层边框与圆角',
    name: 'flush',
    type: 'boolean',
  },
  {
    component: 'Accordion',
    defaultValue: '自动生成',
    description:
      '容器 id 与无障碍 id 前缀，同时渲染到根元素上，并为按钮生成 `{id}-heading-{key}`、为折叠面板生成 `{id}-collapse-{key}` 并互相关联；未设置时仅使用 useId 自动生成关联 id',
    name: 'id',
    type: 'string',
  },
  {
    component: 'Accordion',
    defaultValue: '-',
    description: '选择回调，在任意条目按钮点击且 key 不为 null 时触发',
    name: 'onSelect',
    type: 'AccordionSelectCallback',
  },
  {
    component: 'Accordion',
    defaultValue: "'div'",
    description: '根元素标签，默认渲染 `div.accordion`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AccordionItem',
    defaultValue: '自动生成',
    description:
      '条目唯一 key，未设置时使用 useId 自动生成；Header/Button/Collapse/Body 通过条目上下文消费该 key',
    name: 'eventKey',
    type: 'AccordionEventKey',
  },
  {
    component: 'AccordionItem',
    defaultValue: "'div'",
    description: '根元素标签，默认渲染 `div.accordion-item`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AccordionHeader',
    defaultValue: "'h2'",
    description: '标题标签，默认渲染 `h2.accordion-header`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AccordionHeader',
    defaultValue: '-',
    description: '标题点击回调，透传给内部的 AccordionButton',
    name: 'onClick',
    type: '(event: MouseEvent<HTMLElement>) => void',
  },
  {
    component: 'AccordionHeader',
    defaultValue: '-',
    description: '标题内容，渲染在 accordion-button 内部',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AccordionButton',
    defaultValue: "'button'",
    description: '渲染的元素标签，默认渲染 `button.accordion-button`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AccordionButton',
    defaultValue: '-',
    description:
      '点击回调，触发后事件继续冒泡到 Accordion 切换展开状态，`preventDefault` 可阻止切换',
    name: 'onClick',
    type: '(event: MouseEvent<HTMLElement>) => void',
  },
  {
    component: 'AccordionButton',
    defaultValue: "'button'",
    description: '渲染为原生按钮时的 type 属性',
    name: 'type',
    type: "'button' | 'reset' | 'submit'",
  },
  {
    component: 'AccordionCollapse',
    defaultValue: '条目上下文 key',
    description: '关联 Accordion 激活状态的 key，覆盖所在 AccordionItem 的 eventKey',
    name: 'eventKey',
    type: 'AccordionEventKey',
  },
  {
    component: 'AccordionCollapse',
    defaultValue: '-',
    description: '折叠面板内容，外层渲染 `accordion-collapse` 类并透传 Collapse 组件属性',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AccordionCollapse',
    defaultValue: '-',
    description: '透传 Collapse 组件属性（如 dimension、duration、onEnter、onExited 等）',
    name: '...rest',
    type: 'CollapseProps',
  },
  {
    component: 'AccordionBody',
    defaultValue: "'div'",
    description: '渲染的元素标签，默认渲染 `div.accordion-body`',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AccordionBody',
    defaultValue: '-',
    description: '正文内容，自动包裹在 AccordionCollapse 内',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AccordionBody',
    defaultValue: '-',
    description: '透传 Collapse 组件属性（如 dimension、duration、onEnter、onExited 等）',
    name: '...rest',
    type: 'CollapseProps',
  },
  {
    component: 'useAccordionButton',
    defaultValue: '-',
    description: '目标条目的 key，未设置时回退到所在 AccordionItem 的 eventKey',
    name: 'eventKey',
    type: 'AccordionEventKey',
  },
  {
    component: 'useAccordionButton',
    defaultValue: '-',
    description: '点击回调，触发后继续执行切换逻辑',
    name: 'onClick',
    type: '(event: MouseEvent<HTMLElement>) => void',
  },
  {
    component: 'useAccordionButton',
    defaultValue: '-',
    description:
      '返回可展开到自定义触发器上的按钮属性：onClick、aria-expanded、aria-controls 与 id',
    name: '返回',
    type: 'AccordionButtonHandleProps',
  },
  {
    defaultValue: '-',
    description: '组件内容',
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
    description: '透传原生元素属性（如 onClick、style、role 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const accordionTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: accordionEventKeyTypeCode,
    description: '手风琴条目 key 类型',
    name: 'AccordionEventKey',
  },
  {
    code: accordionSelectCallbackTypeCode,
    description: '手风琴选择回调类型',
    name: 'AccordionSelectCallback',
  },
  {
    code: accordionPropsTypeCode,
    description: 'Accordion 容器组件属性接口',
    name: 'AccordionProps',
  },
  {
    code: accordionContextValueTypeCode,
    description: '手风琴上下文，供各子组件与 useAccordionButton 消费',
    name: 'AccordionContextValue',
  },
  {
    code: accordionItemPropsTypeCode,
    description: '手风琴条目组件属性接口',
    name: 'AccordionItemProps',
  },
  {
    code: accordionItemContextValueTypeCode,
    description: '手风琴条目上下文，供 Header/Button/Collapse/Body 消费',
    name: 'AccordionItemContextValue',
  },
  {
    code: accordionHeaderPropsTypeCode,
    description: '手风琴标题组件属性接口',
    name: 'AccordionHeaderProps',
  },
  {
    code: accordionButtonPropsTypeCode,
    description: '手风琴标题按钮组件属性接口',
    name: 'AccordionButtonProps',
  },
  {
    code: accordionButtonHandlePropsTypeCode,
    description: 'useAccordionButton 返回的按钮属性接口',
    name: 'AccordionButtonHandleProps',
  },
  {
    code: accordionCollapsePropsTypeCode,
    description: '手风琴折叠面板组件属性接口',
    name: 'AccordionCollapseProps',
  },
  {
    code: accordionBodyPropsTypeCode,
    description: '手风琴正文组件属性接口',
    name: 'AccordionBodyProps',
  },
];

const CustomToggle = ({ children, eventKey }: { children: ReactNode; eventKey: string }) => {
  const buttonProps = useAccordionButton(eventKey);

  return (
    <button className="btn btn-outline-primary btn-sm" type="button" {...buttonProps}>
      {children}
    </button>
  );
};

export const AccordionDoc = () => {
  const [activeKey, setActiveKey] = useState<null | string>('0');
  const [activeKeys, setActiveKeys] = useState<string[]>(['a']);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Accordion defaultActiveKey="0" id="accordion-basic-demo">
          <AccordionItem eventKey="0">
            <AccordionHeader>手风琴条目 #1</AccordionHeader>
            <AccordionBody>
              <strong>这是第一个条目的正文。</strong>{' '}
              默认展开，点击标题可再次折叠，同一时刻仅允许一个条目处于展开状态。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="1">
            <AccordionHeader>手风琴条目 #2</AccordionHeader>
            <AccordionBody>
              第二个条目的内容，点击标题后展开，同时第一个条目自动折叠。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="2">
            <AccordionHeader>手风琴条目 #3</AccordionHeader>
            <AccordionBody>
              第三个条目的内容。设置 id 后，按钮与折叠面板自动生成相互关联的 ARIA 属性，无需
              Bootstrap JS。
            </AccordionBody>
          </AccordionItem>
        </Accordion>
        <p className="mb-0 mt-3 text-muted small">
          Accordion 渲染 `div.accordion`，AccordionItem 渲染 `div.accordion-item`，AccordionHeader
          渲染 `h2.accordion-header` 并在内部渲染 `button.accordion-button`，AccordionBody 渲染
          `div.accordion-body`，与 Bootstrap 的手风琴结构一一对应
        </p>
      </DemoSection>

      <DemoSection code={flushCode} title="去边框样式">
        <Accordion defaultActiveKey="0" flush id="accordion-flush-demo">
          <AccordionItem eventKey="0">
            <AccordionHeader>去边框条目 #1</AccordionHeader>
            <AccordionBody>flush 会移除外层边框与圆角，条目直接贴合父容器边缘。</AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="1">
            <AccordionHeader>去边框条目 #2</AccordionHeader>
            <AccordionBody>
              配合父容器已有的边框或圆角使用时，flush 模式能避免重复的边框线。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="2">
            <AccordionHeader>去边框条目 #3</AccordionHeader>
            <AccordionBody>内部条目之间仍保留分隔边框，仅最外层边框被移除。</AccordionBody>
          </AccordionItem>
        </Accordion>
        <p className="mb-0 mt-3 text-muted small">
          flush 为容器追加 `accordion-flush` 类，对应 Bootstrap 的去边框样式
        </p>
      </DemoSection>

      <DemoSection code={alwaysOpenCode} title="多个条目同时展开">
        <Accordion alwaysOpen defaultActiveKey={['0', '1']} id="accordion-always-open-demo">
          <AccordionItem eventKey="0">
            <AccordionHeader>条目 #1（初始展开）</AccordionHeader>
            <AccordionBody>
              alwaysOpen 模式下多个条目可以同时展开，点击已展开的条目会单独折叠它，不影响其他条目。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="1">
            <AccordionHeader>条目 #2（初始展开）</AccordionHeader>
            <AccordionBody>defaultActiveKey 传入数组即可同时初始化多个展开的条目。</AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="2">
            <AccordionHeader>条目 #3</AccordionHeader>
            <AccordionBody>点击该条目时，前两个条目保持展开状态不变。</AccordionBody>
          </AccordionItem>
        </Accordion>
        <p className="mb-0 mt-3 text-muted small">
          alwaysOpen 允许同一时刻展开多个条目，激活状态由 key 数组维护，点击已激活条目将其移出数组
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <Accordion
          activeKey={activeKey}
          id="accordion-controlled-demo"
          onSelect={(key) => {
            if (key == null) {
              return;
            }
            setActiveKey((prev) => {
              const next = String(key);
              return prev === next ? null : next;
            });
          }}
        >
          <AccordionItem eventKey="0">
            <AccordionHeader>受控条目 #1</AccordionHeader>
            <AccordionBody>
              展开状态完全由外部 state 控制，onSelect 在每次点击时触发。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="1">
            <AccordionHeader>受控条目 #2</AccordionHeader>
            <AccordionBody>
              通过 onSelect 维护 state，可以自行决定点击后是展开、折叠还是切换。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="2">
            <AccordionHeader>受控条目 #3</AccordionHeader>
            <AccordionBody>当前激活的 key：{activeKey ?? '无'}。</AccordionBody>
          </AccordionItem>
        </Accordion>
        <Accordion
          activeKey={activeKeys}
          alwaysOpen
          className="mt-3"
          id="accordion-controlled-always-demo"
          onSelect={(key) => {
            if (key == null) {
              return;
            }
            setActiveKeys((prev) => {
              const next = String(key);
              return prev.includes(next) ? prev.filter((item) => item !== next) : [...prev, next];
            });
          }}
        >
          <AccordionItem eventKey="a">
            <AccordionHeader>数组受控 A</AccordionHeader>
            <AccordionBody>
              alwaysOpen 模式下 activeKey 传入数组，onSelect 返回被点击条目的 key。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="b">
            <AccordionHeader>数组受控 B</AccordionHeader>
            <AccordionBody>当前展开的 key：{activeKeys.join('、') || '无'}。</AccordionBody>
          </AccordionItem>
        </Accordion>
        <p className="mb-0 mt-3 text-muted small">
          传入 activeKey 后 Accordion 变为受控组件，切换状态完全由 onSelect 驱动的外部 state
          决定；alwaysOpen 模式下 activeKey 使用数组
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义触发器">
        <Accordion defaultActiveKey="0" id="accordion-custom-demo">
          <AccordionItem eventKey="0">
            <h2 className="accordion-header d-flex gap-2">
              <CustomToggle eventKey="0">自定义触发器</CustomToggle>
              <Badge bg="primary" className="align-self-center" pill>
                3 个条目
              </Badge>
            </h2>
            <AccordionCollapse eventKey="0">
              <div className="card card-body">
                useAccordionButton 返回 aria-expanded 与 aria-controls 等按钮属性，配合
                AccordionCollapse 即可组合出任意结构的触发器。
              </div>
            </AccordionCollapse>
          </AccordionItem>
          <AccordionItem eventKey="1">
            <AccordionHeader as="div">标题标签可替换</AccordionHeader>
            <AccordionBody>
              AccordionHeader 的 as 属性可以替换标题标签，内部仍自动渲染带上下文的 AccordionButton。
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="2">
            <AccordionHeader>带标记的标题</AccordionHeader>
            <AccordionBody>
              AccordionHeader 的子内容直接渲染在 accordion-button 内，可以放置徽标、图标等任意内容。
            </AccordionBody>
          </AccordionItem>
        </Accordion>
        <p className="mb-0 mt-3 text-muted small">
          useAccordionButton 把切换逻辑从样式结构中解耦出来，可搭配任意按钮样式；AccordionButton 与
          AccordionCollapse 同样支持独立组合使用
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的 Accordion 手风琴组件，通过上下文将 Accordion、AccordionItem、AccordionHeader、AccordionButton、AccordionCollapse 与 AccordionBody 按 eventKey 关联，支持单个/多个条目同时展开、去边框样式、受控与非受控模式、自定义触发器与完整的 ARIA 无障碍属性，折叠动画复用 Collapse 组件实现"
      componentName="Accordion"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={accordionProps}
      typeDefinitions={accordionTypeDefinitions}
    />
  );
};

export default AccordionDoc;
