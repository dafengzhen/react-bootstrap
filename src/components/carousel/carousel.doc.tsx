import { useCallback, useState } from 'react';

import type { CarouselDirection } from './types';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import autoplayCode from './demos/autoplay.md?raw';
import captionsCode from './demos/captions.md?raw';
import controlledCode from './demos/controlled.md?raw';
import controlsCode from './demos/controls.md?raw';
import crossfadeCode from './demos/crossfade.md?raw';
import darkCode from './demos/dark.md?raw';
import durationCode from './demos/duration.md?raw';
import eventsCode from './demos/events.md?raw';
import indicatorsCode from './demos/indicators.md?raw';
import intervalCode from './demos/interval.md?raw';
import slidesOnlyCode from './demos/slides-only.md?raw';
import touchCode from './demos/touch.md?raw';
import {
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselInner,
  CarouselItem,
  useCarousel,
} from './index';
import carouselAnimationStatusTypeCode from './types/carousel-animation-status.md?raw';
import carouselCaptionPropsTypeCode from './types/carousel-caption-props.md?raw';
import carouselContextValueTypeCode from './types/carousel-context-value.md?raw';
import carouselControlPropsTypeCode from './types/carousel-control-props.md?raw';
import carouselCssPropertiesTypeCode from './types/carousel-css-properties.md?raw';
import carouselDirectionTypeCode from './types/carousel-direction.md?raw';
import carouselIndicatorPropsTypeCode from './types/carousel-indicator-props.md?raw';
import carouselIndicatorsPropsTypeCode from './types/carousel-indicators-props.md?raw';
import carouselInnerPropsTypeCode from './types/carousel-inner-props.md?raw';
import carouselItemPropsTypeCode from './types/carousel-item-props.md?raw';
import carouselItemRoleTypeCode from './types/carousel-item-role.md?raw';
import carouselPauseTypeCode from './types/carousel-pause.md?raw';
import carouselPropsTypeCode from './types/carousel-props.md?raw';
import carouselRideTypeCode from './types/carousel-ride.md?raw';

const SLIDES = [
  { color: '#0d6efd', label: '第一张幻灯片' },
  { color: '#6c757d', label: '第二张幻灯片' },
  { color: '#198754', label: '第三张幻灯片' },
];

const LIGHT_SLIDES = [
  { color: '#f8f9fa', label: '第一张幻灯片' },
  { color: '#e9ecef', label: '第二张幻灯片' },
  { color: '#dee2e6', label: '第三张幻灯片' },
];

const placeholderImage = (index: number) =>
  `https://picsum.photos/seed/rbs-carousel-${index}/1200/480`;

const ColorSlide = ({
  color,
  dark = false,
  height = 260,
  label,
}: {
  color: string;
  dark?: boolean;
  height?: number;
  label: string;
}) => (
  <div
    className={`align-items-center d-flex justify-content-center ${dark ? 'text-dark' : 'text-white'}`}
    style={{ backgroundColor: color, height }}
  >
    <span className="fs-4 fw-semibold">{label}</span>
  </div>
);

const AutoPlayToggle = () => {
  const { autoPlaying, pause, paused, play } = useCarousel();

  return (
    <div className="bottom-0 end-0 m-2 position-absolute" style={{ zIndex: 3 }}>
      {autoPlaying && paused ? <span className="badge bg-dark me-2">悬停暂停中</span> : null}
      <Button onClick={autoPlaying ? pause : play} size="sm" variant="light">
        {autoPlaying ? '暂停自动播放' : '开始自动播放'}
      </Button>
    </div>
  );
};

const carouselProps: ApiProp[] = [
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '受控的当前幻灯片索引，提供时由外部驱动，需配合 `onSelect` 更新',
    name: 'activeIndex',
    type: 'number',
  },
  {
    component: 'Carousel',
    defaultValue: '0',
    description: '非受控模式下的初始幻灯片索引',
    name: 'defaultActiveIndex',
    type: 'number',
  },
  {
    component: 'Carousel',
    defaultValue: '600',
    description:
      '过渡动画时长（毫秒），会写入 `--rbs-carousel-duration`；系统开启减少动态效果或 `slide` 为 `false` 时按 `0` 处理',
    name: 'duration',
    type: 'number',
  },
  {
    component: 'Carousel',
    defaultValue: 'false',
    description: '使用交叉淡入淡出过渡替代默认的横向滑动过渡（自定义实现，不使用 `carousel-fade`）',
    name: 'fade',
    type: 'boolean',
  },
  {
    component: 'Carousel',
    defaultValue: 'true',
    description: '是否启用过渡动画，为 `false` 时直接切换幻灯片',
    name: 'slide',
    type: 'boolean',
  },
  {
    component: 'Carousel',
    defaultValue: '5000',
    description:
      '自动播放的切换间隔（毫秒），为 `null` 或小于等于 `0` 时不自动切换；可被 `CarouselItem` 的 `interval` 覆盖',
    name: 'interval',
    type: 'null | number',
  },
  {
    component: 'Carousel',
    defaultValue: 'false',
    description:
      '自动播放策略：`"carousel"` 挂载后立即播放，`true` 首次交互后开始播放，`false` 不自动播放',
    name: 'ride',
    type: 'CarouselRide',
  },
  {
    component: 'Carousel',
    defaultValue: "'hover'",
    description:
      '为 `"hover"` 时鼠标悬停或键盘聚焦暂停自动播放，移出后恢复；为 `false` 时不暂停。页面切到后台时始终暂停',
    name: 'pause',
    type: 'CarouselPause',
  },
  {
    component: 'Carousel',
    defaultValue: 'true',
    description: '是否循环播放，为 `false` 时到达首尾后停止，控制按钮会自动禁用',
    name: 'wrap',
    type: 'boolean',
  },
  {
    component: 'Carousel',
    defaultValue: 'true',
    description: '是否响应键盘左右方向键（焦点位于轮播内部时生效，输入类元素中不触发）',
    name: 'keyboard',
    type: 'boolean',
  },
  {
    component: 'Carousel',
    defaultValue: 'true',
    description: '是否支持触摸、触控笔的左右滑动切换（滑动阈值 40px，纵向滑动不触发）',
    name: 'touch',
    type: 'boolean',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description:
      '请求切换回调，由控制按钮、指示器、键盘、滑动或自动播放触发；受控模式下由使用者更新 `activeIndex`',
    name: 'onSelect',
    type: '(index: number, direction: CarouselDirection) => void',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '过渡开始时触发，对应 Bootstrap 的 `slide.bs.carousel` 事件',
    name: 'onSlide',
    type: '(index: number, direction: CarouselDirection) => void',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '过渡结束、当前索引更新后触发，对应 Bootstrap 的 `slid.bs.carousel` 事件',
    name: 'onSlid',
    type: '(index: number, direction: CarouselDirection) => void',
  },
  {
    component: 'Carousel',
    defaultValue: "'region'",
    description: '无障碍角色，建议同时提供 `aria-label` 说明轮播用途',
    name: 'role',
    type: 'AriaRole',
  },
  {
    component: 'Carousel',
    defaultValue: "'carousel'",
    description: '无障碍角色描述，读屏软件会将该区域朗读为“轮播”而非普通区域',
    name: 'aria-roledescription',
    type: 'string',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '轮播内容，通常为 `CarouselIndicators`、`CarouselInner` 与 `CarouselControl`',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '内联样式，支持覆盖 `--rbs-carousel-*` 自定义变量（如缓动函数、滑动距离）',
    name: 'style',
    type: 'CarouselCssProperties',
  },
  {
    component: 'Carousel',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性（如 `id`、`data-bs-theme` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const carouselInnerProps: ApiProp[] = [
  {
    component: 'CarouselInner',
    defaultValue: '-',
    description: '幻灯片列表，每个子节点会被自动注入索引，因此 `CarouselItem` 无需手动指定 `index`',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'CarouselInner',
    defaultValue: "'off' | 'polite'",
    description: '无障碍实时区域属性，自动播放时为 `"off"`，未自动播放时为 `"polite"`',
    name: 'aria-live',
    type: "'assertive' | 'off' | 'polite'",
  },
  {
    component: 'CarouselInner',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'CarouselInner',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const carouselItemProps: ApiProp[] = [
  {
    component: 'CarouselItem',
    defaultValue: '-',
    description:
      '该幻灯片单独的自动切换间隔（毫秒），优先于 `Carousel` 的 `interval`，仅在该幻灯片为当前项时生效',
    name: 'interval',
    type: 'number',
  },
  {
    component: 'CarouselItem',
    defaultValue: '-',
    description: '手动指定索引，默认由 `CarouselInner` 按子节点顺序注入',
    name: 'index',
    type: 'number',
  },
  {
    component: 'CarouselItem',
    defaultValue: '-',
    description: '幻灯片内容，可为图片、纯色区块或任意自定义内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'CarouselItem',
    defaultValue: "'group'",
    description: '无障碍角色，配合 `aria-roledescription="slide"` 使用',
    name: 'role',
    type: 'AriaRole',
  },
  {
    component: 'CarouselItem',
    defaultValue: "'{index} / {count}'",
    description: '无障碍标签，默认为当前序号与总数，可替换为更具体的描述',
    name: 'aria-label',
    type: 'string',
  },
  {
    component: 'CarouselItem',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'CarouselItem',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性（`onTransitionEnd` 会在内部逻辑之后调用）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const carouselIndicatorsProps: ApiProp[] = [
  {
    component: 'CarouselIndicators',
    defaultValue: '-',
    description: '自定义指示器内容，未提供时按幻灯片数量自动生成 `CarouselIndicator`',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'CarouselIndicators',
    defaultValue: '-',
    description: '自动生成指示器时使用的无障碍标签数组，未提供的项回退为 `Slide N`',
    name: 'labels',
    type: 'string[]',
  },
  {
    component: 'CarouselIndicators',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'CarouselIndicators',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const carouselIndicatorProps: ApiProp[] = [
  {
    component: 'CarouselIndicator',
    defaultValue: '-',
    description: '对应的幻灯片索引，点击后切换到该幻灯片（必填）',
    name: 'index',
    type: 'number',
  },
  {
    component: 'CarouselIndicator',
    defaultValue: "'Slide {index}'",
    description: '无障碍标签，当前项会附加 `aria-current="true"`',
    name: 'aria-label',
    type: 'string',
  },
  {
    component: 'CarouselIndicator',
    defaultValue: '-',
    description: '点击时触发的额外回调，调用 `preventDefault()` 可阻止切换',
    name: 'onClick',
    type: 'MouseEventHandler<HTMLButtonElement>',
  },
  {
    component: 'CarouselIndicator',
    defaultValue: "'button'",
    description: '按钮类型',
    name: 'type',
    type: 'string',
  },
  {
    component: 'CarouselIndicator',
    defaultValue: '-',
    description: '自定义类名（组件已附带 `data-bs-target` 以命中 Bootstrap 的指示器样式）',
    name: 'className',
    type: 'string',
  },
  {
    component: 'CarouselIndicator',
    defaultValue: '-',
    description: '透传原生 button 元素的所有属性',
    name: '...rest',
    type: 'ButtonHTMLAttributes',
  },
];

const carouselControlProps: ApiProp[] = [
  {
    component: 'CarouselControl',
    defaultValue: '-',
    description: '控制方向，`"prev"` 渲染上一张按钮，`"next"` 渲染下一张按钮（必填）',
    name: 'direction',
    type: 'CarouselDirection',
  },
  {
    component: 'CarouselControl',
    defaultValue: "'Previous' | 'Next'",
    description: '按钮的读屏文本，渲染为 `visually-hidden` 文本',
    name: 'label',
    type: 'string',
  },
  {
    component: 'CarouselControl',
    defaultValue: '-',
    description: '是否禁用，默认在只有一张幻灯片、或 `wrap` 为 `false` 且已到达边界时自动禁用',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'CarouselControl',
    defaultValue: '-',
    description: '自定义按钮内容，未提供时渲染 Bootstrap 的方向图标与读屏文本',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'CarouselControl',
    defaultValue: '-',
    description: '点击时触发的额外回调，调用 `preventDefault()` 可阻止切换',
    name: 'onClick',
    type: 'MouseEventHandler<HTMLButtonElement>',
  },
  {
    component: 'CarouselControl',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'CarouselControl',
    defaultValue: '-',
    description: '透传原生 button 元素的所有属性',
    name: '...rest',
    type: 'ButtonHTMLAttributes',
  },
];

const carouselCaptionProps: ApiProp[] = [
  {
    component: 'CarouselCaption',
    defaultValue: '-',
    description: '标题内容，通常为标题与描述文本',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'CarouselCaption',
    defaultValue: '-',
    description: '自定义类名，可配合 `d-none d-md-block` 在小屏隐藏',
    name: 'className',
    type: 'string',
  },
  {
    component: 'CarouselCaption',
    defaultValue: '-',
    description: '透传原生 div 元素的所有属性',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const carouselPropsGroups = [
  ...carouselProps,
  ...carouselInnerProps,
  ...carouselItemProps,
  ...carouselIndicatorsProps,
  ...carouselIndicatorProps,
  ...carouselControlProps,
  ...carouselCaptionProps,
];

const carouselTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: carouselDirectionTypeCode,
    description: '轮播切换方向类型',
    name: 'CarouselDirection',
  },
  {
    code: carouselAnimationStatusTypeCode,
    description: '轮播过渡状态类型，由 Reducer 驱动：空闲、已就位（等待双 RAF）、滑动中',
    name: 'CarouselAnimationStatus',
  },
  {
    code: carouselItemRoleTypeCode,
    description: '幻灯片在当前过渡中的角色类型，作为 `data-role` 输出到 DOM 供 CSS 使用',
    name: 'CarouselItemRole',
  },
  {
    code: carouselRideTypeCode,
    description: '自动播放策略类型',
    name: 'CarouselRide',
  },
  {
    code: carouselPauseTypeCode,
    description: '自动播放暂停策略类型',
    name: 'CarouselPause',
  },
  {
    code: carouselCssPropertiesTypeCode,
    description: '轮播支持的自定义 CSS 变量，均以 `--rbs-` 前缀命名',
    name: 'CarouselCssProperties',
  },
  {
    code: carouselPropsTypeCode,
    description: 'Carousel 组件属性接口',
    name: 'CarouselProps',
  },
  {
    code: carouselInnerPropsTypeCode,
    description: 'Carousel 幻灯片容器属性接口',
    name: 'CarouselInnerProps',
  },
  {
    code: carouselItemPropsTypeCode,
    description: 'Carousel 幻灯片属性接口',
    name: 'CarouselItemProps',
  },
  {
    code: carouselIndicatorsPropsTypeCode,
    description: 'Carousel 指示器容器属性接口',
    name: 'CarouselIndicatorsProps',
  },
  {
    code: carouselIndicatorPropsTypeCode,
    description: 'Carousel 单个指示器属性接口',
    name: 'CarouselIndicatorProps',
  },
  {
    code: carouselControlPropsTypeCode,
    description: 'Carousel 控制按钮属性接口',
    name: 'CarouselControlProps',
  },
  {
    code: carouselCaptionPropsTypeCode,
    description: 'Carousel 标题属性接口',
    name: 'CarouselCaptionProps',
  },
  {
    code: carouselContextValueTypeCode,
    description: 'Carousel 上下文，可通过 `useCarousel()` 在子组件中读取状态与控制方法',
    name: 'CarouselContextValue',
  },
];

export const CarouselDoc = () => {
  const [controlledIndex, setControlledIndex] = useState(0);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const handleSelect = useCallback((index: number) => {
    setControlledIndex(index);
  }, []);

  const handleSlide = useCallback((index: number, direction: CarouselDirection) => {
    setEventLog((prev) => [`onSlide → 第 ${index + 1} 张（${direction}）`, ...prev].slice(0, 6));
  }, []);

  const handleSlid = useCallback((index: number, direction: CarouselDirection) => {
    setEventLog((prev) => [`onSlid → 第 ${index + 1} 张（${direction}）`, ...prev].slice(0, 6));
  }, []);

  const demoContent = (
    <>
      <DemoSection code={slidesOnlyCode} title="仅幻灯片">
        <Carousel aria-label="仅幻灯片示例" ride="carousel">
          <CarouselInner>
            {[0, 1, 2].map((index) => (
              <CarouselItem key={index}>
                <img
                  alt={`占位图 ${index + 1}`}
                  className="d-block w-100"
                  src={placeholderImage(index)}
                />
              </CarouselItem>
            ))}
          </CarouselInner>
        </Carousel>
      </DemoSection>

      <DemoSection code={controlsCode} title="带控制按钮">
        <Carousel aria-label="带控制按钮示例">
          <CarouselInner>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={indicatorsCode} title="带指示器">
        <Carousel aria-label="带指示器示例">
          <CarouselIndicators labels={['第一张', '第二张', '第三张']} />
          <CarouselInner>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={captionsCode} title="带标题">
        <Carousel aria-label="带标题示例">
          <CarouselIndicators />
          <CarouselInner>
            {[0, 1, 2].map((index) => (
              <CarouselItem key={index}>
                <img
                  alt={`占位图 ${index + 1}`}
                  className="d-block w-100"
                  src={placeholderImage(index + 10)}
                />
                <CarouselCaption className="d-md-block d-none">
                  <h5>第 {index + 1} 张标题</h5>
                  <p>标题与描述文本会覆盖在幻灯片上，可在小屏通过工具类隐藏。</p>
                </CarouselCaption>
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={crossfadeCode} title="交叉淡入淡出">
        <Carousel aria-label="交叉淡入淡出示例" fade>
          <CarouselInner>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={autoplayCode} title="自动播放">
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <p className="text-muted">
              <code>ride=&quot;carousel&quot;</code>：挂载后立即播放，悬停或聚焦时暂停
            </p>
            <Carousel aria-label="立即自动播放示例" interval={2000} ride="carousel">
              <CarouselIndicators />
              <CarouselInner>
                {SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <ColorSlide color={slide.color} height={200} label={slide.label} />
                  </CarouselItem>
                ))}
              </CarouselInner>
              <AutoPlayToggle />
            </Carousel>
          </div>
          <div className="col-12 col-lg-6">
            <p className="text-muted">
              <code>ride</code>：首次手动切换后开始播放
            </p>
            <Carousel aria-label="交互后自动播放示例" interval={2000} ride>
              <CarouselIndicators />
              <CarouselInner>
                {SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <ColorSlide color={slide.color} height={200} label={slide.label} />
                  </CarouselItem>
                ))}
              </CarouselInner>
              <CarouselControl direction="prev" label="上一张" />
              <CarouselControl direction="next" label="下一张" />
            </Carousel>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={intervalCode} title="单独设置切换间隔">
        <Carousel aria-label="单独设置切换间隔示例" interval={3000} ride="carousel">
          <CarouselIndicators />
          <CarouselInner>
            <CarouselItem interval={1000}>
              <ColorSlide color={SLIDES[0].color} label="停留 1 秒" />
            </CarouselItem>
            <CarouselItem interval={4000}>
              <ColorSlide color={SLIDES[1].color} label="停留 4 秒" />
            </CarouselItem>
            <CarouselItem>
              <ColorSlide color={SLIDES[2].color} label="停留 3 秒（默认间隔）" />
            </CarouselItem>
          </CarouselInner>
        </Carousel>
      </DemoSection>

      <DemoSection code={touchCode} title="禁用触摸滑动">
        <Carousel aria-label="禁用触摸滑动示例" touch={false}>
          <CarouselInner>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={darkCode} title="深色变体">
        <Carousel aria-label="深色变体示例" data-bs-theme="dark">
          <CarouselIndicators />
          <CarouselInner>
            {LIGHT_SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} dark label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控用法">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {SLIDES.map((slide, index) => (
            <Button
              key={slide.label}
              onClick={() => setControlledIndex(index)}
              variant={controlledIndex === index ? 'primary' : 'outline-primary'}
            >
              第 {index + 1} 张
            </Button>
          ))}
          <span className="align-self-center text-muted">
            当前索引：<code>{controlledIndex}</code>
          </span>
        </div>

        <Carousel
          activeIndex={controlledIndex}
          aria-label="受控用法示例"
          onSelect={handleSelect}
          wrap={false}
        >
          <CarouselIndicators />
          <CarouselInner>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>
      </DemoSection>

      <DemoSection code={durationCode} title="过渡时长与减少动态效果">
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <p className="text-muted">
              <code>duration={'{1200}'}</code> 搭配自定义缓动变量
            </p>
            <Carousel
              aria-label="自定义过渡时长示例"
              duration={1200}
              style={{ '--rbs-carousel-easing': 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <CarouselInner>
                {SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <ColorSlide color={slide.color} height={200} label={slide.label} />
                  </CarouselItem>
                ))}
              </CarouselInner>
              <CarouselControl direction="prev" label="上一张" />
              <CarouselControl direction="next" label="下一张" />
            </Carousel>
          </div>
          <div className="col-12 col-lg-6">
            <p className="text-muted">
              <code>slide={'{false}'}</code>：直接切换，无过渡
            </p>
            <Carousel aria-label="无过渡示例" slide={false}>
              <CarouselInner>
                {SLIDES.map((slide) => (
                  <CarouselItem key={slide.label}>
                    <ColorSlide color={slide.color} height={200} label={slide.label} />
                  </CarouselItem>
                ))}
              </CarouselInner>
              <CarouselControl direction="prev" label="上一张" />
              <CarouselControl direction="next" label="下一张" />
            </Carousel>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted">
          系统开启“减少动态效果”（<code>prefers-reduced-motion: reduce</code>
          ）时，过渡时长会自动按 0 处理并直接切换。
        </p>
      </DemoSection>

      <DemoSection code={eventsCode} title="过渡事件">
        <Carousel aria-label="过渡事件示例" onSlid={handleSlid} onSlide={handleSlide}>
          <CarouselIndicators />
          <CarouselInner>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.label}>
                <ColorSlide color={slide.color} height={200} label={slide.label} />
              </CarouselItem>
            ))}
          </CarouselInner>
          <CarouselControl direction="prev" label="上一张" />
          <CarouselControl direction="next" label="下一张" />
        </Carousel>

        <ul className="list-group list-group-flush mt-3">
          {eventLog.length === 0 ? (
            <li className="list-group-item text-muted">切换幻灯片后在此查看事件顺序</li>
          ) : (
            eventLog.map((entry, index) => (
              <li className="list-group-item" key={`${entry}-${index}`}>
                {entry}
              </li>
            ))
          )}
        </ul>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的 Carousel 轮播组件，支持指示器、控制按钮、标题、自动播放（悬停暂停）、单张间隔、键盘与触摸切换、受控模式；滑动与淡入淡出过渡为自定义实现，状态由 useReducer 统一驱动，并通过双 requestAnimationFrame 保证首次挂载动画生效，同时尊重减少动态效果偏好"
      componentName="Carousel"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={carouselPropsGroups}
      typeDefinitions={carouselTypeDefinitions}
    />
  );
};

export default CarouselDoc;
