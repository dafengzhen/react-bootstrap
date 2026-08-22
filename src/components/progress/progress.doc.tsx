import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import animatedCode from './demos/animated.md?raw';
import backgroundsCode from './demos/backgrounds.md?raw';
import basicCode from './demos/basic.md?raw';
import customCode from './demos/custom.md?raw';
import heightCode from './demos/height.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import labelsCode from './demos/labels.md?raw';
import stackedCode from './demos/stacked.md?raw';
import stripedCode from './demos/striped.md?raw';
import { Progress } from './progress';
import { ProgressBar } from './progress-bar';
import { ProgressStacked } from './progress-stacked';
import progressBarPropsTypeCode from './types/progress-bar-props.md?raw';
import progressPropsTypeCode from './types/progress-props.md?raw';
import progressStackedContextValueTypeCode from './types/progress-stacked-context-value.md?raw';
import progressStackedPropsTypeCode from './types/progress-stacked-props.md?raw';
import progressVariantTypeCode from './types/progress-variant.md?raw';

const progressProps: ApiProp[] = [
  {
    component: 'Progress',
    defaultValue: 'false',
    description:
      '是否启用条纹动画，渲染 `progress-bar-animated` 类，并自动附加 `progress-bar-striped` 以保证条纹可见',
    name: 'animated',
    type: 'boolean',
  },
  {
    component: 'Progress',
    defaultValue: "'div'",
    description: '外层 `.progress` 容器渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Progress',
    defaultValue: 'true',
    description:
      '是否自动渲染内部 `.progress-bar`；设为 `false` 时 children 直接渲染在 `.progress` 内，便于手动组合多个 `ProgressBar`',
    name: 'bar',
    type: 'boolean',
  },
  {
    component: 'Progress',
    defaultValue: "'div'",
    description: '内部 `.progress-bar` 渲染的元素类型',
    name: 'barAs',
    type: 'ElementType',
  },
  {
    component: 'Progress',
    defaultValue: '-',
    description: '透传给内部 `ProgressBar` 的属性，可覆盖自动推导的类名、样式与内容',
    name: 'barProps',
    type: 'ProgressBarProps',
  },
  {
    component: 'Progress',
    defaultValue: '-',
    description: '进度条标签内容，默认渲染在内部 `.progress-bar` 中',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Progress',
    defaultValue: '-',
    description: '自定义类名，作用于外层 `.progress` 容器',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Progress',
    defaultValue: '-',
    description:
      '进度条高度，写入 `--bs-progress-height` CSS 变量，数字按 px 处理；未设置时继承 `ProgressStacked` 的高度',
    name: 'height',
    type: 'number | string',
  },
  {
    component: 'Progress',
    defaultValue: "'progress'",
    description: '无障碍名称，渲染为外层容器的 `aria-label`；传入 `aria-labelledby` 时自动省略',
    name: 'label',
    type: 'string',
  },
  {
    component: 'Progress',
    defaultValue: '100',
    description: '最大值，渲染 `aria-valuemax` 并参与宽度百分比计算',
    name: 'max',
    type: 'number',
  },
  {
    component: 'Progress',
    defaultValue: '0',
    description: '最小值，渲染 `aria-valuemin` 并参与宽度百分比计算',
    name: 'min',
    type: 'number',
  },
  {
    component: 'Progress',
    defaultValue: '0',
    description:
      '当前值，渲染 `aria-valuenow`，并按 `(now - min) / (max - min)` 计算宽度百分比；结果自动裁剪到 0% ~ 100%',
    name: 'now',
    type: 'number',
  },
  {
    component: 'Progress',
    defaultValue: "'progressbar'",
    description: '无障碍角色，Bootstrap 5.3 起该角色与 `aria-value*` 均位于外层 `.progress` 上',
    name: 'role',
    type: 'string',
  },
  {
    component: 'Progress',
    defaultValue: 'false',
    description: '是否显示条纹，渲染 `progress-bar-striped` 类',
    name: 'striped',
    type: 'boolean',
  },
  {
    component: 'Progress',
    defaultValue: 'false',
    description:
      '是否使用 `text-bg-*` 替代 `bg-*`，让标签文字自动获得足够对比度，适合带标签的彩色进度条',
    name: 'textBg',
    type: 'boolean',
  },
  {
    component: 'Progress',
    defaultValue: '-',
    description: '进度条颜色变体，为 `.progress-bar` 渲染 `bg-*`（或 `text-bg-*`）工具类',
    name: 'variant',
    type: 'ProgressVariant',
  },
  {
    component: 'Progress',
    defaultValue: '-',
    description: '外层容器的所有原生属性（如 `style`、`aria-labelledby` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'ProgressBar',
    defaultValue: 'false',
    description: '是否启用条纹动画，渲染 `progress-bar-animated` 类，并自动附加条纹类',
    name: 'animated',
    type: 'boolean',
  },
  {
    component: 'ProgressBar',
    defaultValue: "'div'",
    description: '渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ProgressBar',
    defaultValue: '-',
    description: '进度条标签内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ProgressBar',
    defaultValue: '-',
    description: '自定义类名，可配合 `w-*`、`overflow-visible` 等工具类使用',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ProgressBar',
    defaultValue: '100',
    description: '最大值，参与宽度百分比计算',
    name: 'max',
    type: 'number',
  },
  {
    component: 'ProgressBar',
    defaultValue: '0',
    description: '最小值，参与宽度百分比计算',
    name: 'min',
    type: 'number',
  },
  {
    component: 'ProgressBar',
    defaultValue: '-',
    description: '当前值，提供时按百分比写入内联 `width`；未提供时不设置宽度，可改用 `w-*` 工具类',
    name: 'now',
    type: 'number',
  },
  {
    component: 'ProgressBar',
    defaultValue: 'false',
    description: '是否显示条纹，渲染 `progress-bar-striped` 类',
    name: 'striped',
    type: 'boolean',
  },
  {
    component: 'ProgressBar',
    defaultValue: 'false',
    description: '是否使用 `text-bg-*` 替代 `bg-*`',
    name: 'textBg',
    type: 'boolean',
  },
  {
    component: 'ProgressBar',
    defaultValue: '-',
    description: '颜色变体，渲染 `bg-*`（或 `text-bg-*`）工具类',
    name: 'variant',
    type: 'ProgressVariant',
  },
  {
    component: 'ProgressBar',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`aria-hidden` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'ProgressStacked',
    defaultValue: "'div'",
    description: '外层 `.progress-stacked` 容器渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ProgressStacked',
    defaultValue: '-',
    description: '堆叠内容，通常为多个 `Progress`，每个 `Progress` 代表一个分段',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ProgressStacked',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'ProgressStacked',
    defaultValue: '-',
    description:
      '堆叠进度条高度，写入 `--bs-progress-height` CSS 变量，数字按 px 处理；同时下发给未单独设置 height 的子 `Progress`',
    name: 'height',
    type: 'number | string',
  },
  {
    component: 'ProgressStacked',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const progressTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: progressBarPropsTypeCode,
    description: '进度条内层组件属性接口',
    name: 'ProgressBarProps',
  },
  {
    code: progressPropsTypeCode,
    description: '进度条组件属性接口',
    name: 'ProgressProps',
  },
  {
    code: progressStackedContextValueTypeCode,
    description: '堆叠进度条上下文值，可通过 `useProgressStacked` 获取（不在堆叠内返回 `null`）',
    name: 'ProgressStackedContextValue',
  },
  {
    code: progressStackedPropsTypeCode,
    description: '堆叠进度条组件属性接口',
    name: 'ProgressStackedProps',
  },
  {
    code: progressVariantTypeCode,
    description: '进度条颜色变体类型',
    name: 'ProgressVariant',
  },
];

export const ProgressDoc = () => {
  const [value, setValue] = useState(40);

  const variant = value >= 100 ? 'success' : value >= 60 ? 'info' : 'warning';

  const handleDecrease = () => {
    setValue((prev) => Math.max(0, prev - 10));
  };

  const handleIncrease = () => {
    setValue((prev) => Math.min(100, prev + 10));
  };

  const handleReset = () => {
    setValue(0);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div className="d-flex flex-column gap-3">
          <Progress label="基础示例" now={0} />
          <Progress label="基础示例" now={25} />
          <Progress label="基础示例" now={50} />
          <Progress label="基础示例" now={75} />
          <Progress label="基础示例" now={100} />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          Progress 默认渲染 `.progress` 容器与内部 `.progress-bar`，now 会同时写入 `aria-valuenow`
          与进度条宽度
        </p>
      </DemoSection>

      <DemoSection code={labelsCode} title="标签">
        <div className="d-flex flex-column gap-3">
          <Progress label="带标签示例" now={25}>
            25%
          </Progress>
          <Progress
            barProps={{ className: 'overflow-visible text-dark' }}
            label="长标签示例"
            now={10}
          >
            超出进度条宽度的长标签，通过 barProps 添加 overflow-visible 与 text-dark
          </Progress>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          children 渲染在 `.progress-bar` 内作为标签；`.progress-bar` 默认 `overflow: hidden`
          会裁剪超长文本，可通过 barProps 追加 `overflow-visible` 与文字颜色类
        </p>
      </DemoSection>

      <DemoSection code={heightCode} title="高度">
        <div className="d-flex flex-column gap-3">
          <Progress height={1} label="1px 高度示例" now={25} />
          <Progress height={20} label="20px 高度示例" now={25} />
          <Progress height="2rem" label="2rem 高度示例" now={25}>
            25%
          </Progress>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          height 只作用于外层 `.progress`（写入 `--bs-progress-height`
          变量），内部进度条与条纹尺寸会自动跟随
        </p>
      </DemoSection>

      <DemoSection code={backgroundsCode} title="背景色">
        <div className="d-flex flex-column gap-3">
          <Progress label="成功示例" now={25} variant="success" />
          <Progress label="信息示例" now={50} variant="info" />
          <Progress label="警告示例" now={75} variant="warning" />
          <Progress label="危险示例" now={100} variant="danger" />
        </div>
        <div className="d-flex flex-column gap-3 mt-3">
          <Progress label="带标签的警告示例" now={75} textBg variant="warning">
            75%
          </Progress>
          <Progress label="带标签的信息示例" now={50} textBg variant="info">
            50%
          </Progress>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          variant 渲染 `bg-*` 工具类；为彩色进度条添加标签时建议同时开启 textBg，改用 `text-bg-*`
          以获得足够的文字对比度
        </p>
      </DemoSection>

      <DemoSection code={stackedCode} title="多个进度条">
        <ProgressStacked>
          <Progress label="第一段" now={15} />
          <Progress label="第二段" now={30} variant="success" />
          <Progress label="第三段" now={20} variant="info" />
        </ProgressStacked>
        <ProgressStacked className="mt-3" height={8}>
          <Progress label="已完成" now={40} variant="success" />
          <Progress label="进行中" now={25} striped variant="warning" />
          <Progress label="失败" now={10} variant="danger" />
        </ProgressStacked>
        <p className="mb-0 mt-3 text-muted small">
          ProgressStacked 渲染 `.progress-stacked`；位于其中的 Progress
          会自动把宽度写到自身容器上，并继承堆叠容器的 height，无需额外配置
        </p>
      </DemoSection>

      <DemoSection code={stripedCode} title="条纹">
        <div className="d-flex flex-column gap-3">
          <Progress label="默认条纹示例" now={10} striped />
          <Progress label="成功条纹示例" now={25} striped variant="success" />
          <Progress label="信息条纹示例" now={50} striped variant="info" />
          <Progress label="警告条纹示例" now={75} striped variant="warning" />
          <Progress label="危险条纹示例" now={100} striped variant="danger" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          striped 为进度条渲染 `progress-bar-striped`，以 CSS 渐变在背景色之上叠加条纹
        </p>
      </DemoSection>

      <DemoSection code={animatedCode} title="条纹动画">
        <div className="d-flex flex-column gap-3">
          <Progress animated label="条纹动画示例" now={75} />
          <Progress animated label="成功条纹动画示例" now={50} variant="success" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          animated 渲染 `progress-bar-animated`
          并自动补上条纹类；用户开启“减少动态效果”时动画会自动停止
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="手动组合">
        <Progress bar={false} label="手动组合示例" now={70}>
          <ProgressBar now={30} />
          <ProgressBar now={20} variant="success" />
          <ProgressBar now={20} variant="info" />
        </Progress>
        <Progress bar={false} className="mt-3" label="工具类宽度示例" now={75}>
          <ProgressBar className="w-75" />
        </Progress>
        <p className="mb-0 mt-3 text-muted small">
          bar 设为 `false` 时 children 直接渲染在 `.progress` 内，可自由组合多个
          ProgressBar；此时外层 now 表示整体进度，内部分段仅作展示。ProgressBar 未传 now
          时不写内联宽度，可改用 `w-*` 工具类
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互示例">
        <Progress
          animated={value < 100}
          height={20}
          label="上传进度"
          now={value}
          textBg
          variant={variant}
        >
          {value}%
        </Progress>
        <div className="d-flex flex-wrap gap-2 mt-3">
          <Button onClick={handleDecrease} variant="outline-secondary">
            -10
          </Button>
          <Button onClick={handleIncrease} variant="outline-secondary">
            +10
          </Button>
          <Button onClick={handleReset} variant="outline-secondary">
            重置
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 state 驱动 now 即可获得受控进度，当前进度：{value}%
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的进度条组件，用于展示任务或流程的完成情况，支持标签、自定义高度、8 种颜色变体、条纹与条纹动画、堆叠分段以及手动组合多个进度条"
      componentName="Progress"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={progressProps}
      typeDefinitions={progressTypeDefinitions}
    />
  );
};

export default ProgressDoc;
