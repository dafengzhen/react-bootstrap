import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormControl } from '../form-control';
import { Spinner } from '../spinner';
import basicCode from './demos/basic.md?raw';
import colorsCode from './demos/colors.md?raw';
import customCode from './demos/custom.md?raw';
import errorCode from './demos/error.md?raw';
import imageCode from './demos/image.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import shapesCode from './demos/shapes.md?raw';
import sizesCode from './demos/sizes.md?raw';
import { Empty, EmptyImage } from './index';
import emptyBgTypeCode from './types/empty-bg.md?raw';
import emptyImagePropsTypeCode from './types/empty-image-props.md?raw';
import emptyImageShapeTypeCode from './types/empty-image-shape.md?raw';
import emptyPropsTypeCode from './types/empty-props.md?raw';
import emptySizeTypeCode from './types/empty-size.md?raw';

const EMPTY_BG_COLORS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
] as const;

const FRUITS = ['苹果', '香蕉', '樱桃', '榴莲', '芒果'];

const emptyProps: ApiProp[] = [
  {
    component: 'Empty',
    defaultValue: "'div'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Empty',
    defaultValue: '-',
    description: '次要描述文本，渲染在标题之后',
    name: 'description',
    type: 'ReactNode',
  },
  {
    component: 'Empty',
    defaultValue: '-',
    description: '插图区域内容，通常为 EmptyImage，也可传入任意 React 节点，渲染在标题之前',
    name: 'image',
    type: 'ReactNode',
  },
  {
    component: 'Empty',
    defaultValue: "'md'",
    description: '整体尺寸，`sm`/`md`/`lg` 调整内边距与标题字号',
    name: 'size',
    type: 'EmptySize',
  },
  {
    component: 'Empty',
    defaultValue: '-',
    description: '标题文本，渲染在插图之后',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'EmptyImage',
    defaultValue: "''",
    description: '图片替代文本',
    name: 'alt',
    type: 'string',
  },
  {
    component: 'EmptyImage',
    defaultValue: "'span'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'EmptyImage',
    defaultValue: "'secondary'",
    description: '占位背景色变体，未传图片或加载失败时渲染 `bg-*-subtle` 纯色背景',
    name: 'bg',
    type: 'EmptyBg',
  },
  {
    component: 'EmptyImage',
    defaultValue: '160',
    description: '占位高度，数字按像素处理，也可传入任意 CSS 长度',
    name: 'height',
    type: 'number | string',
  },
  {
    component: 'EmptyImage',
    defaultValue: "'图片'",
    description: '纯色占位上显示的说明文字',
    name: 'label',
    type: 'string',
  },
  {
    component: 'EmptyImage',
    defaultValue: "'rounded'",
    description: '占位形状，`circle` 圆形、`rounded` 圆角方形、`square` 方形',
    name: 'shape',
    type: 'EmptyImageShape',
  },
  {
    component: 'EmptyImage',
    defaultValue: '-',
    description: '图片地址（如 Lorem Picsum），加载失败时自动回退为纯色占位',
    name: 'src',
    type: 'string',
  },
  {
    component: 'EmptyImage',
    defaultValue: '240',
    description: '占位宽度，数字按像素处理，也可传入任意 CSS 长度',
    name: 'width',
    type: 'number | string',
  },
  {
    defaultValue: '-',
    description:
      '子内容：Empty 中作为操作区渲染在描述之后，EmptyImage 中作为纯色占位的回退内容（优先于 `label`）',
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

const emptyTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: emptyBgTypeCode,
    description: '占位背景色变体类型',
    name: 'EmptyBg',
  },
  {
    code: emptyImagePropsTypeCode,
    description: '图片占位组件属性接口',
    name: 'EmptyImageProps',
  },
  {
    code: emptyImageShapeTypeCode,
    description: '占位形状类型',
    name: 'EmptyImageShape',
  },
  {
    code: emptyPropsTypeCode,
    description: '空状态组件属性接口',
    name: 'EmptyProps',
  },
  {
    code: emptySizeTypeCode,
    description: '空状态尺寸类型',
    name: 'EmptySize',
  },
];

export const EmptyDoc = () => {
  const [keyword, setKeyword] = useState('');

  const results = FRUITS.filter((fruit) => fruit.includes(keyword));

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <Empty description="暂无数据，请稍后刷新重试" image={<EmptyImage />} title="暂无数据">
          <Button variant="primary">刷新页面</Button>
        </Empty>
        <p className="mb-0 mt-3 text-muted small">
          Empty 自上而下组合 `image`、`title`、`description` 与操作区，未提供 `image`
          时通常只展示纯色占位块与说明文字
        </p>
      </DemoSection>

      <DemoSection code={imageCode} title="图片占位">
        <Empty
          description="图片占位地址可以使用 Lorem Picsum 等任意图片服务"
          image={<EmptyImage alt="示例图片" src="https://picsum.photos/seed/rbs-empty/640/400" />}
          title="图片占位"
        />
        <p className="mb-0 mt-3 text-muted small">
          传入 `src` 渲染真实图片，图片按 cover 方式裁剪填充整个占位区域
        </p>
      </DemoSection>

      <DemoSection code={colorsCode} title="纯色背景">
        <div className="d-flex flex-wrap gap-3 justify-content-around">
          {EMPTY_BG_COLORS.map((bg) => (
            <EmptyImage bg={bg} height={80} key={bg} label={bg} width={120} />
          ))}
        </div>
        <p className="mb-0 mt-3 text-muted small">
          未传入 `src` 时渲染 `bg` 对应的 `bg-*-subtle` 纯色背景，`label` 显示占位说明文字，
          可直接替代外部图片服务
        </p>
      </DemoSection>

      <DemoSection code={errorCode} title="图片加载失败回退">
        <Empty
          description="图片地址不可用时自动回退为纯色背景占位，避免出现空白区域"
          image={<EmptyImage alt="失效图片" src="https://invalid.example.com/empty.png" />}
          title="加载失败回退"
        />
      </DemoSection>

      <DemoSection code={shapesCode} title="形状">
        <div className="d-flex flex-wrap gap-3 justify-content-around">
          <EmptyImage
            alt="圆形占位图"
            shape="circle"
            src="https://picsum.photos/seed/rbs-empty-circle/200/200"
          />
          <EmptyImage alt="圆角占位图" src="https://picsum.photos/seed/rbs-empty-rounded/240/160" />
          <EmptyImage
            alt="方形占位图"
            shape="square"
            src="https://picsum.photos/seed/rbs-empty-square/200/200"
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `shape` 渲染 `circle`/`rounded`/`square` 三种圆角，默认为 `rounded`
        </p>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-wrap gap-3 justify-content-around">
          <Empty
            description="小型空状态，适合紧凑容器"
            image={<EmptyImage height={80} width={120} />}
            size="sm"
            style={{ width: 280 }}
            title="小尺寸"
          />
          <Empty
            description="默认空状态"
            image={<EmptyImage height={120} width={180} />}
            style={{ width: 280 }}
            title="默认尺寸"
          />
          <Empty
            description="大型空状态，适合整页占位"
            image={<EmptyImage height={200} width={300} />}
            size="lg"
            style={{ width: 280 }}
            title="大尺寸"
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `size` 调整内边距与标题字号，`EmptyImage` 的 `width`/`height` 独立控制插图尺寸
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义插图">
        <Empty
          description="image 插槽支持任意 React 节点，如动画图标、自定义 SVG 或彩色徽标"
          image={
            <div
              className="bg-info-subtle rounded-circle d-flex align-items-center justify-content-center"
              style={{ height: 96, width: 96 }}
            >
              <Spinner variant="info" />
            </div>
          }
          title="自定义插图"
        >
          <Button variant="outline-secondary">返回首页</Button>
        </Empty>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互示例">
        <FormControl
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="输入关键字筛选，试试「葡萄」"
          value={keyword}
        />
        {results.length > 0 ? (
          <ul className="list-group mt-3">
            {results.map((fruit) => (
              <li className="list-group-item" key={fruit}>
                {fruit}
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            description={`没有找到与「${keyword}」匹配的结果`}
            image={<EmptyImage bg="warning" height={100} label="无结果" width={160} />}
            title="未找到匹配项"
          >
            <Button onClick={() => setKeyword('')} variant="outline-secondary">
              清除搜索
            </Button>
          </Empty>
        )}
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的空状态组件，用于展示无数据、无搜索结果等空白场景的占位内容，通过 Empty 组合插图、标题、描述与操作按钮，EmptyImage 提供图片占位（支持 Lorem Picsum 等任意图片地址）、加载失败自动回退纯色背景、八种背景色变体以及多种形状与尺寸"
      componentName="Empty"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={emptyProps}
      typeDefinitions={emptyTypeDefinitions}
    />
  );
};

export default EmptyDoc;
