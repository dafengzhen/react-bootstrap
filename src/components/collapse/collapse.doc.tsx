import { useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import accessibilityCode from './demos/accessibility.md?raw';
import basicCode from './demos/basic.md?raw';
import durationCode from './demos/duration.md?raw';
import eventsCode from './demos/events.md?raw';
import horizontalCode from './demos/horizontal.md?raw';
import multipleTargetsCode from './demos/multiple-targets.md?raw';
import { Collapse } from './index';
import collapseAnimationStatusTypeCode from './types/collapse-animation-status.md?raw';
import collapseDimensionTypeCode from './types/collapse-dimension.md?raw';
import collapsePropsTypeCode from './types/collapse-props.md?raw';

const collapseProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '受控的展开状态，为 true 时展开内容，为 false 时折叠内容并在过渡结束后卸载',
    name: 'in',
    type: 'boolean',
  },
  {
    defaultValue: "'height'",
    description:
      "折叠维度，'height' 为垂直折叠（高度过渡），'width' 为水平折叠（宽度过渡，对应 Bootstrap 的 collapse-horizontal）",
    name: 'dimension',
    type: 'CollapseDimension',
  },
  {
    defaultValue: '300',
    description: '展开与折叠过渡动画时长（毫秒），系统开启减少动态效果时自动为 0',
    name: 'duration',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '展开开始（show）时触发，此时元素即将挂载并开始测量内容尺寸',
    name: 'onEnter',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '展开过渡开始（元素已挂载并完成尺寸测量，高度/宽度开始过渡）时触发',
    name: 'onEntering',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '展开过渡完成（shown）时触发，此时元素尺寸恢复为 auto，内容可自然撑开',
    name: 'onEntered',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '折叠开始（hide）时触发，此时会先测量并冻结当前尺寸再开始收缩',
    name: 'onExit',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '折叠过渡开始（尺寸开始向 0 收缩）时触发',
    name: 'onExiting',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '折叠过渡完成（hidden）时触发，此时元素已卸载',
    name: 'onExited',
    type: '() => void',
  },
  {
    defaultValue: '-',
    description: '折叠内容',
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
    description: '透传原生 div 元素的所有属性（如 id、role、aria-* 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const collapseTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: collapseDimensionTypeCode,
    description: 'Collapse 折叠维度类型',
    name: 'CollapseDimension',
  },
  {
    code: collapseAnimationStatusTypeCode,
    description: 'Collapse 过渡动画状态类型',
    name: 'CollapseAnimationStatus',
  },
  {
    code: collapsePropsTypeCode,
    description: 'Collapse 组件属性接口',
    name: 'CollapseProps',
  },
];

export const CollapseDoc = () => {
  const [a11yOpen, setA11yOpen] = useState(false);
  const [basicOpen, setBasicOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [fastOpen, setFastOpen] = useState(false);
  const [horizontalOpen, setHorizontalOpen] = useState(false);
  const [lastEvent, setLastEvent] = useState('-');
  const [multipleOpen, setMultipleOpen] = useState(false);
  const [slowOpen, setSlowOpen] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Button
          aria-controls="collapse-basic"
          aria-expanded={basicOpen}
          onClick={() => setBasicOpen((prev) => !prev)}
          variant="primary"
        >
          切换折叠内容
        </Button>

        <Collapse id="collapse-basic" in={basicOpen}>
          <div className="card card-body mt-3">
            Some placeholder content for the collapse component. This panel is hidden by default but
            revealed when the user activates the relevant trigger.
          </div>
        </Collapse>
      </DemoSection>

      <DemoSection code={horizontalCode} title="水平折叠">
        <Button
          aria-controls="collapse-horizontal"
          aria-expanded={horizontalOpen}
          onClick={() => setHorizontalOpen((prev) => !prev)}
          variant="primary"
        >
          切换宽度折叠
        </Button>

        <div className="mt-3" style={{ minHeight: 120 }}>
          <Collapse dimension="width" id="collapse-horizontal" in={horizontalOpen}>
            <div className="card card-body" style={{ width: 300 }}>
              This is some placeholder content for a horizontal collapse. It's hidden by default and
              shown when triggered.
            </div>
          </Collapse>
        </div>
      </DemoSection>

      <DemoSection code={multipleTargetsCode} title="多个目标">
        <Button
          aria-controls="collapse-target-a collapse-target-b"
          aria-expanded={multipleOpen}
          onClick={() => setMultipleOpen((prev) => !prev)}
          variant="primary"
        >
          同时切换两个折叠区域
        </Button>

        <div className="row mt-3">
          <div className="col">
            <Collapse id="collapse-target-a" in={multipleOpen}>
              <div className="card card-body">第一个折叠区域的内容</div>
            </Collapse>
          </div>
          <div className="col">
            <Collapse id="collapse-target-b" in={multipleOpen}>
              <div className="card card-body">第二个折叠区域的内容</div>
            </Collapse>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={eventsCode} title="事件回调">
        <Button
          aria-controls="collapse-events"
          aria-expanded={eventsOpen}
          onClick={() => setEventsOpen((prev) => !prev)}
          variant="primary"
        >
          切换折叠
        </Button>
        <span className="text-muted ms-2">最近事件：{lastEvent}</span>

        <Collapse
          id="collapse-events"
          in={eventsOpen}
          onEnter={() => setLastEvent('onEnter')}
          onEntered={() => setLastEvent('onEntered')}
          onEntering={() => setLastEvent('onEntering')}
          onExit={() => setLastEvent('onExit')}
          onExited={() => setLastEvent('onExited')}
          onExiting={() => setLastEvent('onExiting')}
        >
          <div className="card card-body mt-3">
            观察展开与折叠过程中依次触发的事件回调，对应 Bootstrap 的 show、shown、hide、hidden
            事件。
          </div>
        </Collapse>
      </DemoSection>

      <DemoSection code={durationCode} title="自定义时长">
        <div className="d-flex gap-2">
          <Button
            aria-controls="collapse-fast"
            aria-expanded={fastOpen}
            onClick={() => setFastOpen((prev) => !prev)}
            size="sm"
            variant="outline-primary"
          >
            快速折叠（150ms）
          </Button>
          <Button
            aria-controls="collapse-slow"
            aria-expanded={slowOpen}
            onClick={() => setSlowOpen((prev) => !prev)}
            size="sm"
            variant="outline-primary"
          >
            慢速折叠（900ms）
          </Button>
        </div>

        <Collapse duration={150} id="collapse-fast" in={fastOpen}>
          <div className="card card-body mt-3">duration 为 150 毫秒，过渡更快。</div>
        </Collapse>
        <Collapse duration={900} id="collapse-slow" in={slowOpen}>
          <div className="card card-body mt-3">duration 为 900 毫秒，过渡更慢。</div>
        </Collapse>
      </DemoSection>

      <DemoSection code={accessibilityCode} title="无障碍">
        <Button
          aria-controls="collapse-a11y"
          aria-expanded={a11yOpen}
          onClick={() => setA11yOpen((prev) => !prev)}
          variant="primary"
        >
          展开更多信息
        </Button>

        <Collapse id="collapse-a11y" in={a11yOpen}>
          <div className="card card-body mt-3">
            触发器通过 aria-expanded 与 aria-controls 关联折叠区域，折叠区域通过 id
            与触发器对应，屏幕阅读器可以借助这些属性定位折叠区域。
          </div>
        </Collapse>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的 Collapse 折叠组件，通过高度或宽度过渡动画切换内容的显示与隐藏，支持垂直/水平两种折叠维度、多个目标联动、完整的事件回调与减少动态效果偏好，过渡状态由 useReducer 统一驱动，首次挂载的过渡动画通过双重 requestAnimationFrame 保证生效"
      componentName="Collapse"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={collapseProps}
      typeDefinitions={collapseTypeDefinitions}
    />
  );
};

export default CollapseDoc;
