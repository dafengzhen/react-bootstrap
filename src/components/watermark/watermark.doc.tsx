import { useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import customCode from './demos/custom.md?raw';
import fullscreenCode from './demos/fullscreen.md?raw';
import hookCode from './demos/hook.md?raw';
import imageCode from './demos/image.md?raw';
import multilineCode from './demos/multiline.md?raw';
import { useWatermark, Watermark } from './index';
import useWatermarkOptionsTypeCode from './types/use-watermark-options.md?raw';
import useWatermarkResultTypeCode from './types/use-watermark-result.md?raw';
import watermarkFontOptionsTypeCode from './types/watermark-font-options.md?raw';
import watermarkPropsTypeCode from './types/watermark-props.md?raw';
import watermarkTextAlignTypeCode from './types/watermark-text-align.md?raw';

const CustomDemo = () => {
  const [fontColor, setFontColor] = useState('#adb5bd');
  const [fontSize, setFontSize] = useState(16);
  const [gapValue, setGapValue] = useState(100);
  const [opacity, setOpacity] = useState(30);
  const [rotate, setRotate] = useState(-22);

  return (
    <>
      <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
        <label className="mb-0 small" htmlFor="watermark-rotate">
          角度 {rotate}°
        </label>
        <input
          className="form-range mb-0"
          id="watermark-rotate"
          max={90}
          min={-90}
          onChange={(event) => setRotate(Number(event.target.value))}
          style={{ width: 140 }}
          type="range"
          value={rotate}
        />
        <label className="mb-0 small" htmlFor="watermark-gap">
          间距 {gapValue}px
        </label>
        <input
          className="form-range mb-0"
          id="watermark-gap"
          max={200}
          min={0}
          onChange={(event) => setGapValue(Number(event.target.value))}
          style={{ width: 140 }}
          type="range"
          value={gapValue}
        />
        <label className="mb-0 small" htmlFor="watermark-opacity">
          透明度 {opacity}%
        </label>
        <input
          className="form-range mb-0"
          id="watermark-opacity"
          max={100}
          min={0}
          onChange={(event) => setOpacity(Number(event.target.value))}
          style={{ width: 140 }}
          type="range"
          value={opacity}
        />
        <label className="mb-0 small" htmlFor="watermark-font-size">
          字号 {fontSize}px
        </label>
        <input
          className="form-range mb-0"
          id="watermark-font-size"
          max={32}
          min={10}
          onChange={(event) => setFontSize(Number(event.target.value))}
          style={{ width: 140 }}
          type="range"
          value={fontSize}
        />
        <input
          aria-label="水印颜色"
          className="form-control form-control-color"
          onChange={(event) => setFontColor(event.target.value)}
          title="选择水印颜色"
          type="color"
          value={fontColor}
        />
      </div>
      <Watermark
        content="React Bootstrap"
        font={{ color: fontColor, fontSize }}
        gap={[gapValue, gapValue]}
        opacity={opacity / 100}
        rotate={rotate}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">可调参数水印</h5>
            <p className="card-text mb-0">
              拖动上方滑块实时调整旋转角度、平铺间距、透明度、字号与颜色，所有变化都会立即重新生成水印图案。
            </p>
          </div>
        </div>
      </Watermark>
    </>
  );
};

const FullscreenDemo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button className="btn btn-primary" onClick={() => setVisible((prev) => !prev)} type="button">
        {visible ? '关闭全屏水印' : '开启全屏水印'}
      </button>
      {visible && (
        <Watermark
          content="机密文件 · 请勿外传"
          fullscreen
          gap={[140, 140]}
          opacity={0.5}
          rotate={-30}
          zIndex={1030}
        />
      )}
    </>
  );
};

const HookDemo = () => {
  const { dataUrl, height, width } = useWatermark({
    content: 'useWatermark 自定义组合',
    gap: [60, 60],
    opacity: 0.5,
    rotate: -25,
  });

  return (
    <div
      className="border rounded-3 p-4"
      style={{
        backgroundImage: dataUrl ? `url('${dataUrl}')` : undefined,
        backgroundRepeat: 'repeat',
        backgroundSize: `${width}px ${height}px`,
      }}
    >
      <h5 className="mb-2">任意容器上的水印</h5>
      <p className="mb-0 text-muted">
        useWatermark 返回生成的 dataUrl 与平铺块尺寸，可挂到任意元素的背景上自行组合；Watermark
        组件本身即基于该 Hook 实现。
      </p>
    </div>
  );
};

const watermarkProps: ApiProp[] = [
  {
    component: 'Watermark',
    defaultValue: '-',
    description: '水印文本内容，字符串数组表示多行文本；与 image 二选一，都为空时不渲染水印层',
    name: 'content',
    type: 'string | string[]',
  },
  {
    component: 'Watermark',
    defaultValue: '-',
    description:
      '水印图片地址，以跨域方式加载后绘制到 Canvas；与 content 二选一，图片加载失败时不渲染水印层',
    name: 'image',
    type: 'string',
  },
  {
    component: 'Watermark',
    defaultValue:
      '{ color: "rgba(0, 0, 0, 0.15)", fontFamily: "sans-serif", fontSize: 14, fontStyle: "normal", fontWeight: "normal", textAlign: "center" }',
    description: '文本水印字体选项：颜色、字体族、字号、字体样式、字重与对齐方式',
    name: 'font',
    type: 'WatermarkFontOptions',
  },
  {
    component: 'Watermark',
    defaultValue: '-22',
    description: '水印旋转角度（度），正数表示顺时针旋转',
    name: 'rotate',
    type: 'number',
  },
  {
    component: 'Watermark',
    defaultValue: '[100, 100]',
    description: '水印平铺间距：[水平间距, 垂直间距]（像素）',
    name: 'gap',
    type: '[number, number]',
  },
  {
    component: 'Watermark',
    defaultValue: '内容自动计算',
    description:
      '平铺块宽度（像素）：文本模式下覆盖自动计算的平铺块宽度，图片模式下缩放绘制图片的宽度（只设置一个维度时按原图比例缩放）',
    name: 'width',
    type: 'number',
  },
  {
    component: 'Watermark',
    defaultValue: '内容自动计算',
    description:
      '平铺块高度（像素）：文本模式下覆盖自动计算的平铺块高度，图片模式下缩放绘制图片的高度（只设置一个维度时按原图比例缩放）',
    name: 'height',
    type: 'number',
  },
  {
    component: 'Watermark',
    defaultValue: '[0, 0]',
    description: '水印层背景偏移：[水平偏移, 垂直偏移]（像素），可微调图案起始位置',
    name: 'offset',
    type: '[number, number]',
  },
  {
    component: 'Watermark',
    defaultValue: '1',
    description:
      '水印整体透明度，范围 0 ~ 1，超出范围自动收敛到边界值；与 font.color 的 alpha 叠加生效（最终透明度 = color alpha × opacity），图片水印同样适用',
    name: 'opacity',
    type: 'number',
  },
  {
    component: 'Watermark',
    defaultValue: '-',
    description: '水印层 z-index；未设置时水印层作为最后一个定位子元素自然覆盖内容',
    name: 'zIndex',
    type: 'number',
  },
  {
    component: 'Watermark',
    defaultValue: 'false',
    description:
      '开启后水印层通过 Portal 渲染到 body 并以 position: fixed 覆盖整个视口，内容仍在原位置正常渲染',
    name: 'fullscreen',
    type: 'boolean',
  },
  {
    component: 'Watermark',
    defaultValue: '-',
    description: '被水印覆盖的内容，渲染在水印层下方',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Watermark',
    defaultValue: '-',
    description: '外层容器元素的自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Watermark',
    defaultValue: '-',
    description: '外层容器元素的内联样式',
    name: 'style',
    type: 'CSSProperties',
  },
  {
    component: 'useWatermark',
    defaultValue: '-',
    description: '水印文本内容，与组件的 content 行为一致',
    name: 'content',
    type: 'string | string[]',
  },
  {
    component: 'useWatermark',
    defaultValue: '-',
    description: '水印图片地址，与组件的 image 行为一致',
    name: 'image',
    type: 'string',
  },
  {
    component: 'useWatermark',
    defaultValue: '{ color: "rgba(0, 0, 0, 0.15)", fontFamily: "sans-serif", fontSize: 14 }',
    description: '文本水印字体选项，与组件的 font 行为一致',
    name: 'font',
    type: 'WatermarkFontOptions',
  },
  {
    component: 'useWatermark',
    defaultValue: '-22',
    description: '旋转角度，与组件的 rotate 行为一致',
    name: 'rotate',
    type: 'number',
  },
  {
    component: 'useWatermark',
    defaultValue: '[100, 100]',
    description: '平铺间距，与组件的 gap 行为一致',
    name: 'gap',
    type: '[number, number]',
  },
  {
    component: 'useWatermark',
    defaultValue: '-',
    description: '平铺块宽度，与组件的 width 行为一致',
    name: 'width',
    type: 'number',
  },
  {
    component: 'useWatermark',
    defaultValue: '-',
    description: '平铺块高度，与组件的 height 行为一致',
    name: 'height',
    type: 'number',
  },
  {
    component: 'useWatermark',
    defaultValue: '1',
    description: '整体透明度，与组件的 opacity 行为一致',
    name: 'opacity',
    type: 'number',
  },
  {
    component: 'useWatermark',
    defaultValue: '-',
    description:
      '返回的生成结果：dataUrl 为图案 Data URL（空字符串表示尚未生成或配置为空），width/height 为平铺块尺寸（像素），配合 backgroundImage 与 backgroundSize 使用',
    name: 'dataUrl / width / height',
    type: 'UseWatermarkResult',
  },
  {
    defaultValue: '-',
    description: '透传原生元素属性（如 `onClick`、`role` 等，作用于外层容器元素）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const watermarkTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: watermarkPropsTypeCode,
    description: '水印容器组件属性接口',
    name: 'WatermarkProps',
  },
  {
    code: watermarkFontOptionsTypeCode,
    description: '文本水印字体选项',
    name: 'WatermarkFontOptions',
  },
  {
    code: watermarkTextAlignTypeCode,
    description: '文本水印对齐方式联合类型',
    name: 'WatermarkTextAlign',
  },
  {
    code: useWatermarkOptionsTypeCode,
    description: '水印图案生成 Hook 配置项',
    name: 'UseWatermarkOptions',
  },
  {
    code: useWatermarkResultTypeCode,
    description: '水印图案生成 Hook 返回值',
    name: 'UseWatermarkResult',
  },
];

export const WatermarkDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Watermark content="React Bootstrap">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">受保护内容区域</h5>
              <p className="card-text mb-0">
                水印默认以 -22°
                倾斜、半透明灰色文字平铺在内容之上，不遮挡阅读，也不影响内容的正常交互。
              </p>
            </div>
          </div>
        </Watermark>
        <p className="mb-0 mt-3 text-muted small">
          Watermark 包裹需要保护的内容：水印层使用 Canvas 生成图案后以 background-repeat
          平铺，pointer-events: none 保证所有交互都能穿透到内容
        </p>
      </DemoSection>

      <DemoSection code={multilineCode} title="多行文本">
        <Watermark
          content={['React Bootstrap', '机密文档 · 禁止外传']}
          font={{ fontSize: 16, fontWeight: 600 }}
          gap={[120, 120]}
        >
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">多行文本水印</h5>
              <p className="card-text mb-0">
                content 传入字符串数组时每个元素渲染为一行，配合 font 选项可以调整水印的视觉重量。
              </p>
            </div>
          </div>
        </Watermark>
        <p className="mb-0 mt-3 text-muted small">
          多行文本自动整体居中排列，font 中的 fontSize、fontWeight、color 等选项与 Canvas
          文本绘制参数一一对应
        </p>
      </DemoSection>

      <DemoSection code={imageCode} title="图片水印">
        <Watermark gap={[80, 80]} image="/android-chrome-192x192.png" opacity={0.35} width={48}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">图片水印</h5>
              <p className="card-text mb-0">
                使用站点图标作为水印图片：width 将其缩放为 48px 后重复平铺，跨域加载后绘制到
                Canvas。
              </p>
            </div>
          </div>
        </Watermark>
        <p className="mb-0 mt-3 text-muted small">
          图片以跨域方式异步加载后绘制到 Canvas；width、height
          未设置时按图片原始尺寸绘制，只设置一个维度时按原图比例缩放
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义样式">
        <CustomDemo />
        <p className="mb-0 mt-3 text-muted small">
          rotate、gap、opacity、font 均支持实时调整，任何参数变化都会自动重新生成水印图案
        </p>
      </DemoSection>

      <DemoSection code={fullscreenCode} title="全屏水印">
        <FullscreenDemo />
        <p className="mb-0 mt-3 text-muted small">
          fullscreen 模式下水印层通过 Portal 渲染到 body，以 position: fixed 覆盖整个视口；由于
          pointer-events: none，页面其余部分仍可正常交互
        </p>
      </DemoSection>

      <DemoSection code={hookCode} title="Hook 自定义组合">
        <HookDemo />
        <p className="mb-0 mt-3 text-muted small">
          useWatermark 返回 dataUrl 与平铺块尺寸，可挂到任意元素的背景上自行组合；Watermark
          组件本身即基于该 Hook 实现
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Canvas 的水印组件，为内容区域平铺文字或图片水印，支持多行文本、图片水印、旋转角度、平铺间距、偏移、透明度与 z-index 自定义，全屏 Portal 模式，以及 useWatermark Hook 自定义组合"
      componentName="Watermark"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={watermarkProps}
      typeDefinitions={watermarkTypeDefinitions}
    />
  );
};

export default WatermarkDoc;
