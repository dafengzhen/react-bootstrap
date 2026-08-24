import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import centerCode from './demos/center.md?raw';
import disabledCode from './demos/disabled.md?raw';
import dotsCode from './demos/dots.md?raw';
import errorCode from './demos/error.md?raw';
import iconsCode from './demos/icons.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import verticalCode from './demos/vertical.md?raw';
import { Steps } from './steps';
import { StepsItem } from './steps-item';
import stepsContextValueTypeCode from './types/steps-context-value.md?raw';
import stepsDirectionTypeCode from './types/steps-direction.md?raw';
import stepsItemPropsTypeCode from './types/steps-item-props.md?raw';
import stepsPropsTypeCode from './types/steps-props.md?raw';
import stepsStatusTypeCode from './types/steps-status.md?raw';
import stepsVariantTypeCode from './types/steps-variant.md?raw';

const stepsProps: ApiProp[] = [
  {
    component: 'Steps',
    defaultValue: '-',
    description:
      '受控的当前步骤序号（从 0 开始）；提供后点击步骤不会自动更新，仅触发 onChange 回调',
    name: 'active',
    type: 'number',
  },
  {
    component: 'Steps',
    defaultValue: "'ol'",
    description: '根列表渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Steps',
    defaultValue: 'false',
    description: '是否在水平布局中将指示器与标题、描述居中显示；仅 `horizontal` 方向生效',
    name: 'center',
    type: 'boolean',
  },
  {
    component: 'Steps',
    defaultValue: '-',
    description: '步骤内容，仅识别 `StepsItem`，其余子项会被忽略',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Steps',
    defaultValue: '-',
    description: '自定义类名，作用于根列表',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Steps',
    defaultValue: 'true',
    description: '是否允许点击步骤切换当前步骤；设为 `false` 时仅作展示',
    name: 'clickable',
    type: 'boolean',
  },
  {
    component: 'Steps',
    defaultValue: '0',
    description: '非受控模式下的初始步骤序号',
    name: 'defaultActive',
    type: 'number',
  },
  {
    component: 'Steps',
    defaultValue: "'horizontal'",
    description: '布局方向，`horizontal` 横向排列、`vertical` 纵向排列',
    name: 'direction',
    type: 'StepsDirection',
  },
  {
    component: 'Steps',
    defaultValue: '-',
    description: '点击步骤时回调，参数为新的步骤序号',
    name: 'onChange',
    type: '(active: number) => void',
  },
  {
    component: 'Steps',
    defaultValue: "'default'",
    description: '指示器样式，`default` 为圆形序号，`dots` 为小圆点',
    name: 'variant',
    type: 'StepsVariant',
  },
  {
    component: 'Steps',
    defaultValue: '-',
    description: '根列表的所有原生属性（如 `style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'StepsItem',
    defaultValue: "'li'",
    description: '列表项渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '步骤额外内容，渲染在描述之后',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '自定义类名，作用于列表项',
    name: 'className',
    type: 'string',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '步骤描述内容',
    name: 'description',
    type: 'ReactNode',
  },
  {
    component: 'StepsItem',
    defaultValue: 'false',
    description: '是否禁用该步骤的点击',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '自定义指示器内容，替代序号、勾号或叉号',
    name: 'icon',
    type: 'ReactNode',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '手动指定步骤状态，覆盖根据 `active` 推导的状态',
    name: 'status',
    type: 'StepsStatus',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '步骤标题内容',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'StepsItem',
    defaultValue: '-',
    description: '列表项的所有原生属性（如 `style`、`onClick` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const stepsTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: stepsPropsTypeCode,
    description: '步骤条组件属性接口',
    name: 'StepsProps',
  },
  {
    code: stepsItemPropsTypeCode,
    description: '步骤项组件属性接口',
    name: 'StepsItemProps',
  },
  {
    code: stepsContextValueTypeCode,
    description: '步骤条上下文值，可通过 `useSteps` 获取（不在 `Steps` 内返回 `null`）',
    name: 'StepsContextValue',
  },
  {
    code: stepsDirectionTypeCode,
    description: '步骤条布局方向类型',
    name: 'StepsDirection',
  },
  {
    code: stepsStatusTypeCode,
    description: '步骤状态类型',
    name: 'StepsStatus',
  },
  {
    code: stepsVariantTypeCode,
    description: '步骤条指示器样式类型',
    name: 'StepsVariant',
  },
];

export const StepsDoc = () => {
  const [active, setActive] = useState(0);

  const steps = [
    { description: '填写账户信息并完成实名认证', title: '填写信息' },
    { description: '选择支付方式并完成付款', title: '支付' },
    { description: '商家确认后尽快安排发货', title: '发货' },
  ];

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Steps active={1}>
          <StepsItem description="填写账户信息" title="填写信息" />
          <StepsItem description="选择支付方式" title="支付" />
          <StepsItem description="等待商家发货" title="发货" />
        </Steps>
        <Steps active={2} className="mt-4">
          <StepsItem description="第一步" title="登录" />
          <StepsItem description="第二步" title="验证" />
          <StepsItem description="第三步" title="结算" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">
          active 之前的步骤显示为完成状态，active
          所在步骤为进行中，其余为等待中；完成步骤的指示器渲染为勾号
        </p>
      </DemoSection>

      <DemoSection code={centerCode} title="居中布局">
        <Steps active={1} center>
          <StepsItem description="填写账户信息并完成实名认证" title="填写信息" />
          <StepsItem description="选择支付方式并完成付款" title="支付" />
          <StepsItem description="商家确认后尽快安排发货" title="发货" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">
          center 开启后，指示器与标题、描述在各自的步骤列中水平居中，连接线从相邻指示器之间衔接；仅
          horizontal 方向生效
        </p>
      </DemoSection>

      <DemoSection code={verticalCode} title="垂直布局">
        <Steps active={1} direction="vertical">
          <StepsItem description="填写账户信息并完成实名认证" title="填写信息" />
          <StepsItem description="选择支付方式并完成付款" title="支付" />
          <StepsItem description="商家确认后尽快安排发货" title="发货" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">
          direction 设为 vertical 时步骤纵向排列，连接线跟随各步骤内容高度延伸
        </p>
      </DemoSection>

      <DemoSection code={dotsCode} title="圆点样式">
        <Steps active={2} variant="dots">
          <StepsItem description="填写账户信息" title="填写信息" />
          <StepsItem description="选择支付方式" title="支付" />
          <StepsItem description="等待商家发货" title="发货" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">
          variant 设为 dots 时指示器渲染为小圆点，进行中的圆点附带光环
        </p>
      </DemoSection>

      <DemoSection code={iconsCode} title="自定义图标">
        <Steps active={1}>
          <StepsItem description="填写账户信息" icon={<span>📝</span>} title="填写信息" />
          <StepsItem description="选择支付方式" icon={<span>💳</span>} title="支付" />
          <StepsItem description="等待商家发货" icon={<span>🚚</span>} title="发货" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">
          通过 icon 传入任意内容即可替换指示器，优先级高于序号与勾号
        </p>
      </DemoSection>

      <DemoSection code={errorCode} title="错误状态">
        <Steps active={1}>
          <StepsItem description="填写账户信息" title="填写信息" />
          <StepsItem description="支付失败，请重新选择支付方式" status="error" title="支付" />
          <StepsItem description="等待商家发货" title="发货" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">
          为单个步骤设置 status=&quot;error&quot;
          可覆盖位置推导，指示器渲染为叉号并使用危险色；错误不会向后传播
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用步骤">
        <Steps active={1}>
          <StepsItem description="已完成" title="登录" />
          <StepsItem description="不可点击" disabled title="验证" />
          <StepsItem description="等待中" title="结算" />
        </Steps>
        <p className="mb-0 mt-3 text-muted small">禁用步骤无法点击切换，并整体降低透明度</p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互示例">
        <Steps active={active} onChange={setActive}>
          {steps.map((step) => (
            <StepsItem description={step.description} key={step.title} title={step.title} />
          ))}
        </Steps>
        <div className="d-flex gap-2 mt-4">
          <Button
            disabled={active === 0}
            onClick={() => setActive((prev) => prev - 1)}
            variant="outline-secondary"
          >
            上一步
          </Button>
          <Button
            disabled={active === steps.length - 1}
            onClick={() => setActive((prev) => prev + 1)}
            variant="primary"
          >
            下一步
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          点击步骤即可切换当前步骤：受控时通过 active 与 onChange
          管理，非受控时由组件内部维护（defaultActive 设置初始值）
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的步骤条组件，用于展示一个流程的进度与当前状态，支持横向/纵向布局、居中布局、圆点样式、自定义图标、错误状态、禁用步骤以及点击切换的受控/非受控模式"
      componentName="Steps"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={stepsProps}
      typeDefinitions={stepsTypeDefinitions}
    />
  );
};

export default StepsDoc;
