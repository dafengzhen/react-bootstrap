import { type ChangeEvent, useState } from 'react';

import type { RatioAspectRatio } from './types';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormSelect } from '../form-select';
import { Col, Row } from '../layout';
import asCode from './demos/as.md?raw';
import basicCode from './demos/basic.md?raw';
import customStringCode from './demos/custom-string.md?raw';
import customCode from './demos/custom.md?raw';
import embedCode from './demos/embed.md?raw';
import gridCode from './demos/grid.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import presetsCode from './demos/presets.md?raw';
import { Ratio } from './ratio';
import ratioAspectRatioTypeCode from './types/ratio-aspect-ratio.md?raw';
import ratioPropsTypeCode from './types/ratio-props.md?raw';

const ratioProps: ApiProp[] = [
  {
    defaultValue: "'div'",
    description:
      '渲染的根元素类型，默认渲染 `div`，可传入 `figure`、`section` 等语义化元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: "'1x1'",
    description:
      '宽高比：预设字符串渲染 `ratio-*` 类；任意字符串生成 `ratio-<aspectRatio>` 类，可配合自定义 CSS 使用；数字则写入 `--bs-aspect-ratio` 变量——小于 1 时按小数百分比处理（0.75 → 75%），大于等于 1 时按整数百分比处理（2 → 200% 竖屏比例），小于等于 0 时回退为 100%',
    name: 'aspectRatio',
    type: 'RatioAspectRatio | number',
  },
  {
    defaultValue: '-',
    description:
      '唯一子元素，会被绝对定位并拉伸铺满整个容器，通常传入 `img`、`iframe`、`video` 等媒体元素',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '自定义类名，可组合 `bg-*`、`rounded`、`overflow-hidden` 等工具类调整容器外观',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description:
      '根元素的所有原生属性（如 `style`、`id` 等）；数字比例时 `style` 会与 `--bs-aspect-ratio` 合并',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
];

const ratioTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: ratioAspectRatioTypeCode,
    description: '宽高比类型，四个预设比例或任意自定义字符串',
    name: 'RatioAspectRatio',
  },
  {
    code: ratioPropsTypeCode,
    description: '比例容器组件属性接口',
    name: 'RatioProps',
  },
];

export const RatioDoc = () => {
  const [aspectRatio, setAspectRatio] = useState<number | RatioAspectRatio>('16x9');

  const handleAspectRatioChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (value.startsWith('custom:')) {
      setAspectRatio(Number.parseFloat(value.slice('custom:'.length)));
    } else {
      setAspectRatio(value as RatioAspectRatio);
    }
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Ratio aspectRatio="16x9" style={{ maxWidth: '32rem' }}>
          <img
            alt="16:9 宽屏图片"
            className="object-fit-cover"
            src="https://picsum.photos/seed/rbs-ratio-basic/800/450"
          />
        </Ratio>
        <p className="mb-0 mt-3 text-muted small">
          子元素会被绝对定位并拉伸铺满容器，图片配合 `object-fit-cover`
          即可在保持比例的同时裁切铺满，容器高度由宽度与比例自动决定
        </p>
      </DemoSection>

      <DemoSection code={presetsCode} title="预设比例">
        <Row className="g-3">
          <Col md={3} sm={6}>
            <Ratio aspectRatio="1x1" className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                1x1
              </div>
            </Ratio>
          </Col>
          <Col md={3} sm={6}>
            <Ratio aspectRatio="4x3" className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                4x3
              </div>
            </Ratio>
          </Col>
          <Col md={3} sm={6}>
            <Ratio aspectRatio="16x9" className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                16x9
              </div>
            </Ratio>
          </Col>
          <Col md={3} sm={6}>
            <Ratio aspectRatio="21x9" className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                21x9
              </div>
            </Ratio>
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          内置 1x1、4x3、16x9、21x9 四种预设，分别渲染 `ratio-1x1`、`ratio-4x3`、`ratio-16x9`、
          `ratio-21x9` 类，对应 100%、75%、56.25%、42.857% 的 padding-top
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义数字比例">
        <Row className="g-3">
          <Col md={4} sm={6}>
            <Ratio aspectRatio={9 / 16} className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                9 / 16
              </div>
            </Ratio>
          </Col>
          <Col md={4} sm={6}>
            <Ratio aspectRatio={0.75} className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                0.75
              </div>
            </Ratio>
          </Col>
          <Col md={4} sm={6}>
            <Ratio aspectRatio={2} className="bg-body-tertiary rounded">
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                2（竖屏）
              </div>
            </Ratio>
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          传入数字时写入 `--bs-aspect-ratio` 内联变量：小于 1 视为小数百分比（9 / 16 →
          56.25%），大于等于 1 视为整数百分比（2 → 200%，即 1:2 竖屏比例），小于等于 0 时回退为 100%
        </p>
      </DemoSection>

      <DemoSection code={customStringCode} title="自定义字符串比例">
        <style>{`.ratio-4x5 { --bs-aspect-ratio: 80%; }`}</style>
        <Ratio aspectRatio="4x5" className="bg-body-tertiary rounded" style={{ maxWidth: '16rem' }}>
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            4x5
          </div>
        </Ratio>
        <p className="mb-0 mt-3 text-muted small">
          任意字符串会直接生成 `ratio-&lt;aspectRatio&gt;` 类，只需在自定义样式表中为该类设置
          `--bs-aspect-ratio` 即可扩展比例；未定义时回退为默认的 100%
        </p>
      </DemoSection>

      <DemoSection code={embedCode} title="视频嵌入">
        <Ratio aspectRatio="16x9">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
            title="YouTube 视频"
          />
        </Ratio>
        <p className="mb-0 mt-3 text-muted small">
          嵌入视频是比例容器最常见的场景，iframe 随容器宽度缩放并保持 16:9 比例
        </p>
      </DemoSection>

      <DemoSection code={gridCode} title="图片网格">
        <Row className="g-3">
          <Col md={6}>
            <Ratio aspectRatio="4x3" className="overflow-hidden rounded">
              <img
                alt="山间风景"
                className="object-fit-cover"
                src="https://picsum.photos/seed/rbs-ratio-grid-1/640/480"
              />
            </Ratio>
          </Col>
          <Col md={6}>
            <Ratio aspectRatio="4x3" className="overflow-hidden rounded">
              <img
                alt="城市街景"
                className="object-fit-cover"
                src="https://picsum.photos/seed/rbs-ratio-grid-2/640/480"
              />
            </Ratio>
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          在网格中组合 `rounded` 与 `overflow-hidden`，即可得到统一比例、圆角裁切的图片卡片
        </p>
      </DemoSection>

      <DemoSection code={asCode} title="自定义元素">
        <div className="d-flex flex-column gap-3">
          <Ratio as="figure" aspectRatio="16x9" className="bg-body-tertiary rounded">
            <img
              alt="示例图片"
              className="object-fit-cover"
              src="https://picsum.photos/seed/rbs-ratio-as/800/450"
            />
          </Ratio>
          <Ratio as="section" aspectRatio="4x3" className="bg-body-tertiary rounded">
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              as="section"
            </div>
          </Ratio>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 as 渲染为 figure、section 等语义化元素，在保留比例行为的同时提升页面语义
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex flex-column gap-3">
          <FormSelect
            aria-label="选择宽高比"
            className="w-auto"
            onChange={handleAspectRatioChange}
            value={typeof aspectRatio === 'number' ? `custom:${aspectRatio}` : aspectRatio}
          >
            <option value="1x1">1x1</option>
            <option value="4x3">4x3</option>
            <option value="16x9">16x9</option>
            <option value="21x9">21x9</option>
            <option value="custom:0.5">0.5（50%）</option>
            <option value="custom:0.75">0.75（75%）</option>
            <option value="custom:1">1（100%）</option>
            <option value="custom:2">2（200%）</option>
          </FormSelect>
          <Ratio
            aspectRatio={aspectRatio}
            className="bg-body-tertiary rounded"
            style={{ maxWidth: '36rem' }}
          >
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              {typeof aspectRatio === 'number' ? `${aspectRatio * 100}%` : aspectRatio}
            </div>
          </Ratio>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的宽高比容器组件，为图片、视频、iframe 等媒体内容提供固定比例的响应式容器，支持四种预设比例与数字、字符串自定义比例，并可渲染为任意语义化元素"
      componentName="Ratio"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={ratioProps}
      typeDefinitions={ratioTypeDefinitions}
    />
  );
};

export default RatioDoc;
