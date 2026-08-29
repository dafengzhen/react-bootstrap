import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customCode from './demos/custom.md?raw';
import groupCode from './demos/group.md?raw';
import imageCode from './demos/image.md?raw';
import toolbarCode from './demos/toolbar.md?raw';
import transformCode from './demos/transform.md?raw';
import viewerCode from './demos/viewer.md?raw';
import {
  Image,
  ImageGroup,
  ImageViewer,
  type ImageViewerImage,
  type ImageViewerToolbarKey,
  useImageViewer,
} from './index';
import imageGroupPropsTypeCode from './types/image-group-props.md?raw';
import imagePropsTypeCode from './types/image-props.md?raw';
import imageViewerContextValueTypeCode from './types/image-viewer-context-value.md?raw';
import imageViewerImageTypeCode from './types/image-viewer-image.md?raw';
import imageViewerPropsTypeCode from './types/image-viewer-props.md?raw';
import imageViewerSourceTypeCode from './types/image-viewer-source.md?raw';
import imageViewerToolbarKeyTypeCode from './types/image-viewer-toolbar-key.md?raw';

// oxlint-disable-next-line perf/sort-arrays
const DEMO_TOOLBAR: ImageViewerToolbarKey[] = [
  'zoomIn',
  'zoomOut',
  'rotateLeft',
  'rotateRight',
  'reset',
  'close',
];

const VIEWER_IMAGES: ImageViewerImage[] = [
  {
    alt: '峡谷日出',
    caption: '峡谷日出 · 清晨的第一缕阳光',
    src: 'https://picsum.photos/seed/rbs-viewer-1/1600/1000',
  },
  {
    alt: '林间小道',
    caption: '林间小道 · 雨后森林',
    src: 'https://picsum.photos/seed/rbs-viewer-2/1600/1000',
  },
  {
    alt: '湖畔倒影',
    caption: '湖畔倒影 · 宁静的湖面',
    src: 'https://picsum.photos/seed/rbs-viewer-3/1600/1000',
  },
  {
    alt: '星空银河',
    caption: '星空银河 · 夏夜露营',
    src: 'https://picsum.photos/seed/rbs-viewer-4/1600/1000',
  },
];

const CustomToolbarFooter = () => {
  const viewer = useImageViewer();
  if (viewer === null) {
    return null;
  }
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center">
      <Button onClick={viewer.previous} size="sm" variant="outline-light">
        上一张
      </Button>
      <Button onClick={viewer.zoomOut} size="sm" variant="outline-light">
        缩小
      </Button>
      <Button onClick={viewer.reset} size="sm" variant="outline-light">
        复位
      </Button>
      <Button onClick={viewer.zoomIn} size="sm" variant="outline-light">
        放大
      </Button>
      <Button onClick={viewer.next} size="sm" variant="outline-light">
        下一张
      </Button>
    </div>
  );
};

const imageViewerProps: ApiProp[] = [
  {
    component: 'Image',
    defaultValue: "''",
    description: '图片替代文本，未提供时预览按钮使用默认无障碍标签',
    name: 'alt',
    type: 'string',
  },
  {
    component: 'Image',
    defaultValue: 'false',
    description: '是否应用 `img-fluid` 流式布局',
    name: 'fluid',
    type: 'boolean',
  },
  {
    component: 'Image',
    defaultValue: 'true',
    description: '是否启用点击预览，`false` 时渲染原生 img 元素',
    name: 'preview',
    type: 'boolean',
  },
  {
    component: 'Image',
    defaultValue: '-',
    description: '预览使用的图片地址，默认与 `src` 相同',
    name: 'previewSrc',
    type: 'string',
  },
  {
    component: 'Image',
    defaultValue: 'false',
    description: '是否应用 `rounded` 圆角样式',
    name: 'rounded',
    type: 'boolean',
  },
  {
    component: 'Image',
    defaultValue: 'false',
    description: '是否应用 `rounded-circle` 圆形样式',
    name: 'roundedCircle',
    type: 'boolean',
  },
  {
    component: 'Image',
    defaultValue: 'true',
    description: '悬停或聚焦时是否显示预览遮罩',
    name: 'showPreviewMask',
    type: 'boolean',
  },
  {
    component: 'Image',
    defaultValue: 'false',
    description: '是否应用 `img-thumbnail` 缩略图样式',
    name: 'thumbnail',
    type: 'boolean',
  },
  {
    component: 'Image',
    defaultValue: '-',
    description: '透传给内部 ImageViewer 的配置，仅当 Image 独立使用（不在 ImageGroup 内）时生效',
    name: 'viewerProps',
    type: 'ImageViewerGroupViewerProps',
  },
  {
    component: 'ImageGroup',
    defaultValue: "'div'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'ImageGroup',
    defaultValue: '-',
    description: '透传给分组 ImageViewer 的配置',
    name: 'viewerProps',
    type: 'ImageViewerGroupViewerProps',
  },
  {
    component: 'ImageViewer',
    defaultValue: 'true',
    description: "遮罩行为：`true` 点击遮罩关闭、`'static'` 不响应点击、`false` 不渲染遮罩",
    name: 'backdrop',
    type: "boolean | 'static'",
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '自定义底部内容，配合 `useImageViewer` 可组合自定义工具栏',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'ImageViewer',
    defaultValue: '0',
    description: '非受控模式下初始显示的图片索引',
    name: 'defaultIndex',
    type: 'number',
  },
  {
    component: 'ImageViewer',
    defaultValue: 'false',
    description: '非受控模式下初始是否打开',
    name: 'defaultOpen',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: '200',
    description: '打开/关闭过渡时长（毫秒），跟随系统减少动态效果设置自动降为 0',
    name: 'duration',
    type: 'number',
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '图片列表，支持字符串地址或 `ImageViewerImage` 对象，必填',
    name: 'images',
    type: 'ImageViewerSource[]',
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '受控模式下的当前索引，配合 `onIndexChange` 使用',
    name: 'index',
    type: 'number',
  },
  {
    component: 'ImageViewer',
    defaultValue: 'true',
    description: '是否启用键盘操作：Esc 关闭、左右方向键切换、+/- 缩放、0 复位、R 旋转',
    name: 'keyboard',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: 'false',
    description: '是否在首尾循环切换图片',
    name: 'loop',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: '10',
    description: '最大缩放倍数',
    name: 'maxZoom',
    type: 'number',
  },
  {
    component: 'ImageViewer',
    defaultValue: '0.5',
    description: '最小缩放倍数',
    name: 'minZoom',
    type: 'number',
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '图片加载失败时的回调',
    name: 'onImageError',
    type: '(image, index, event) => void',
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '当前图片索引变化时的回调',
    name: 'onIndexChange',
    type: '(index: number) => void',
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '打开状态变化时的回调',
    name: 'onOpenChange',
    type: '(open: boolean) => void',
  },
  {
    component: 'ImageViewer',
    defaultValue: '-',
    description: '受控模式下的打开状态，配合 `onOpenChange` 使用',
    name: 'open',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: '多图时为 true',
    description: '是否显示「当前 / 总数」计数器',
    name: 'showCounter',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: '多图时为 true',
    description: '是否显示上一张/下一张切换按钮',
    name: 'showNav',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: '多图时为 true',
    description: '是否显示底部缩略图导航条',
    name: 'showThumbnails',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: 'true',
    description: '工具栏配置：`true` 显示全部按钮、`false` 隐藏、数组按给定顺序渲染指定按钮',
    name: 'toolbar',
    type: 'boolean | ImageViewerToolbarKey[]',
  },
  {
    component: 'ImageViewer',
    defaultValue: 'true',
    description: '是否启用缩放，关闭后按钮、滚轮与双击缩放均不可用',
    name: 'zoomable',
    type: 'boolean',
  },
  {
    component: 'ImageViewer',
    defaultValue: '0.25',
    description: '每次缩放操作的步进倍数',
    name: 'zoomStep',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '子内容：ImageViewer 中作为底部自定义区域渲染',
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
    description: '透传原生元素属性（如 `style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const imageViewerTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: imagePropsTypeCode,
    description: '图片缩略图组件属性接口',
    name: 'ImageProps',
  },
  {
    code: imageGroupPropsTypeCode,
    description: '图片分组组件属性接口',
    name: 'ImageGroupProps',
  },
  {
    code: imageViewerPropsTypeCode,
    description: '图片查看器组件属性接口',
    name: 'ImageViewerProps',
  },
  {
    code: imageViewerImageTypeCode,
    description: '查看器图片对象，支持描述文本与下载文件名',
    name: 'ImageViewerImage',
  },
  {
    code: imageViewerSourceTypeCode,
    description: '图片数据源类型，字符串或图片对象',
    name: 'ImageViewerSource',
  },
  {
    code: imageViewerToolbarKeyTypeCode,
    description: '工具栏按钮键类型',
    name: 'ImageViewerToolbarKey',
  },
  {
    code: imageViewerContextValueTypeCode,
    description: '查看器上下文值，`useImageViewer` 的返回值',
    name: 'ImageViewerContextValue',
  },
];

export const ImageViewerDoc = () => {
  const [controlledIndex, setControlledIndex] = useState(0);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [transformOpen, setTransformOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <Image
          alt="山谷日出"
          fluid
          rounded
          src="https://picsum.photos/seed/rbs-viewer-basic/1200/800"
          style={{ maxWidth: 480 }}
        />
        <p className="mb-0 mt-3 text-muted small">
          Image 默认开启点击预览，悬停时显示缩放遮罩，点击后在灯箱中查看大图，支持缩放、旋转与全屏
        </p>
      </DemoSection>

      <DemoSection code={imageCode} title="图片样式">
        <div className="d-flex flex-wrap gap-3 align-items-end">
          <Image
            alt="默认图片"
            src="https://picsum.photos/seed/rbs-viewer-plain/480/320"
            style={{ width: 200 }}
          />
          <Image
            alt="流式圆角图片"
            fluid
            rounded
            src="https://picsum.photos/seed/rbs-viewer-rounded/480/320"
            style={{ width: 200 }}
          />
          <Image
            alt="圆形图片"
            roundedCircle
            src="https://picsum.photos/seed/rbs-viewer-circle/200/200"
            style={{ width: 96 }}
          />
          <Image
            alt="缩略图样式"
            src="https://picsum.photos/seed/rbs-viewer-thumbnail/480/320"
            style={{ width: 200 }}
            thumbnail
          />
          <Image
            alt="禁用预览的图片"
            fluid
            preview={false}
            src="https://picsum.photos/seed/rbs-viewer-no-preview/480/320"
            style={{ width: 200 }}
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `fluid`、`rounded`、`roundedCircle`、`thumbnail` 对应 Bootstrap 图片工具类，`preview=
          {false}` 时渲染原生 img 元素且不启用预览
        </p>
      </DemoSection>

      <DemoSection code={groupCode} title="分组预览">
        <ImageGroup>
          <Image
            alt="第一张"
            fluid
            rounded
            src="https://picsum.photos/seed/rbs-group-1/800/600"
            style={{ width: 140 }}
          />
          <Image
            alt="第二张"
            fluid
            rounded
            src="https://picsum.photos/seed/rbs-group-2/800/600"
            style={{ width: 140 }}
          />
          <Image
            alt="第三张"
            fluid
            rounded
            src="https://picsum.photos/seed/rbs-group-3/800/600"
            style={{ width: 140 }}
          />
          <Image
            alt="第四张"
            fluid
            rounded
            src="https://picsum.photos/seed/rbs-group-4/800/600"
            style={{ width: 140 }}
          />
        </ImageGroup>
        <p className="mb-0 mt-3 text-muted small">
          ImageGroup 内的 Image 点击后共享同一个查看器，从当前图片开始并可在分组内前后切换
        </p>
      </DemoSection>

      <DemoSection code={viewerCode} title="多图查看器">
        <Button onClick={() => setViewerOpen(true)} variant="primary">
          打开图片查看器
        </Button>
        <ImageViewer images={VIEWER_IMAGES} loop onOpenChange={setViewerOpen} open={viewerOpen} />
        <p className="mb-0 mt-3 text-muted small">
          多图时默认显示计数器、左右切换按钮与底部缩略图，点击图片以外的遮罩区域或按 Esc 关闭，
          `loop` 开启首尾循环，图片对象的 `caption` 显示为底部说明
        </p>
      </DemoSection>

      <DemoSection code={transformCode} title="缩放与旋转">
        <Button onClick={() => setTransformOpen(true)} variant="primary">
          打开查看器
        </Button>
        <ImageViewer
          images={[
            'https://picsum.photos/seed/rbs-transform-1/1600/1000',
            'https://picsum.photos/seed/rbs-transform-2/1600/1000',
          ]}
          onOpenChange={setTransformOpen}
          open={transformOpen}
        />
        <p className="mb-0 mt-3 text-muted small">
          滚轮或 +/- 键缩放、双击快速切换 1x/2x、放大后拖拽平移，工具栏或 R 键旋转，0 键复位
        </p>
      </DemoSection>

      <DemoSection code={toolbarCode} title="工具栏定制">
        <Button onClick={() => setToolbarOpen(true)} variant="primary">
          打开查看器
        </Button>
        <ImageViewer
          images={[
            { alt: '自定义工具栏', src: 'https://picsum.photos/seed/rbs-toolbar/1600/1000' },
            'https://picsum.photos/seed/rbs-toolbar-2/1600/1000',
          ]}
          onOpenChange={setToolbarOpen}
          open={toolbarOpen}
          toolbar={DEMO_TOOLBAR}
        />
        <p className="mb-0 mt-3 text-muted small">
          通过数组按顺序挑选按钮，此示例移除了下载与全屏；`toolbar={false}` 则完全隐藏工具栏
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义组合">
        <Button onClick={() => setCustomOpen(true)} variant="primary">
          打开查看器
        </Button>
        <ImageViewer
          images={VIEWER_IMAGES}
          onOpenChange={setCustomOpen}
          open={customOpen}
          showNav={false}
          toolbar={false}
        >
          <CustomToolbarFooter />
        </ImageViewer>
        <p className="mb-0 mt-3 text-muted small">
          关闭内置工具栏与切换按钮，通过 `children` 底部插槽和 `useImageViewer` 钩子完全自定义操作区
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <div className="d-flex align-items-center gap-2">
          <Button onClick={() => setControlledOpen(true)} variant="primary">
            打开查看器
          </Button>
          <span className="text-muted small">
            当前索引：{controlledIndex + 1} / {VIEWER_IMAGES.length}
          </span>
        </div>
        <ImageViewer
          images={VIEWER_IMAGES}
          index={controlledIndex}
          onIndexChange={setControlledIndex}
          onOpenChange={setControlledOpen}
          open={controlledOpen}
        />
        <p className="mb-0 mt-3 text-muted small">
          `open`/`index` 与 `onOpenChange`/`onIndexChange` 组合实现完全受控，外部状态随切换实时同步
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的图片查看组件族，通过 Image 提供点击预览的缩略图，ImageGroup 将多张图片聚合为分组预览，ImageViewer 提供全屏灯箱查看器，支持缩放、旋转、拖拽平移、键盘操作、缩略图导航、全屏与下载，并可通过受控模式与 useImageViewer 钩子灵活组合自定义工具栏"
      componentName="ImageViewer"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={imageViewerProps}
      typeDefinitions={imageViewerTypeDefinitions}
    />
  );
};

export default ImageViewerDoc;
