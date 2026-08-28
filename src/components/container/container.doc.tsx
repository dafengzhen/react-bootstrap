import { type ChangeEvent, useState } from 'react';

import type { ContainerFluid } from './types';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormSelect } from '../form-select';
import { Col, Row } from '../layout';
import { Container } from './container';
import asElementCode from './demos/as.md?raw';
import defaultCode from './demos/default.md?raw';
import fluidCode from './demos/fluid.md?raw';
import gridCode from './demos/grid.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import responsiveCode from './demos/responsive.md?raw';
import containerFluidTypeCode from './types/container-fluid.md?raw';
import containerPropsTypeCode from './types/container-props.md?raw';

const containerProps: ApiProp[] = [
  {
    defaultValue: "'div'",
    description:
      '渲染的根元素类型，默认渲染 `div`，可传入 `section`、`main` 等语义化元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '自定义类名，可组合 `p-*`、`bg-*` 等工具类调整内边距与背景',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: 'false',
    description:
      '容器模式：传入 true 渲染 `container-fluid`；传入断点（如 `md`）渲染 `container-md`，低于该断点时占满全宽、达到断点后定宽；省略或为 false 时渲染默认 `container`',
    name: 'fluid',
    type: 'ContainerFluid | boolean',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
];

const containerTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: containerFluidTypeCode,
    description: '容器响应式断点类型',
    name: 'ContainerFluid',
  },
  {
    code: containerPropsTypeCode,
    description: '容器组件属性接口',
    name: 'ContainerProps',
  },
];

export const ContainerDoc = () => {
  const [fluid, setFluid] = useState<boolean | ContainerFluid>(false);

  const handleFluidChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value === 'true') {
      setFluid(true);
    } else if (value === 'false') {
      setFluid(false);
    } else {
      setFluid(value as ContainerFluid);
    }
  };

  const demoContent = (
    <>
      <DemoSection code={defaultCode} title="默认容器">
        <Container className="border bg-body-tertiary p-3">
          默认容器在每个响应式断点下使用不同的最大宽度，并自动水平居中
        </Container>
        <p className="mb-0 mt-3 text-muted small">
          默认渲染 `container` 类，sm 以下占满全宽，之后随断点依次固定在
          540px、720px、960px、1140px、1320px
        </p>
      </DemoSection>

      <DemoSection code={fluidCode} title="流式容器">
        <Container className="border bg-body-tertiary p-3" fluid>
          流式容器在任意视口宽度下始终占满整个可用宽度
        </Container>
        <p className="mb-0 mt-3 text-muted small">
          传入 fluid 渲染 `container-fluid`，宽度始终为 100%，不受断点限制
        </p>
      </DemoSection>

      <DemoSection code={responsiveCode} title="响应式容器">
        <Container className="border bg-body-tertiary my-2 p-3" fluid="sm">
          视口 &lt; 576px 时占满全宽，≥576px 后定宽
        </Container>
        <Container className="border bg-body-tertiary my-2 p-3" fluid="md">
          视口 &lt; 768px 时占满全宽，≥768px 后定宽
        </Container>
        <Container className="border bg-body-tertiary my-2 p-3" fluid="lg">
          视口 &lt; 992px 时占满全宽，≥992px 后定宽
        </Container>
        <Container className="border bg-body-tertiary my-2 p-3" fluid="xl">
          视口 &lt; 1200px 时占满全宽，≥1200px 后定宽
        </Container>
        <Container className="border bg-body-tertiary my-2 p-3" fluid="xxl">
          视口 &lt; 1400px 时占满全宽，≥1400px 后定宽
        </Container>
        <p className="mb-0 mt-3 text-muted small">
          传入断点（sm、md、lg、xl、xxl）渲染对应的 `container-*`
          类，低于该断点时占满全宽，达到断点后恢复定宽
        </p>
      </DemoSection>

      <DemoSection code={gridCode} title="与网格组合">
        <Container className="border bg-body-tertiary">
          <Row>
            <Col>1 / 3</Col>
            <Col>2 / 3</Col>
            <Col>3 / 3</Col>
          </Row>
        </Container>
        <p className="mb-0 mt-3 text-muted small">
          Container 通常包裹 Row 与 Col，构成完整的页面网格布局骨架
        </p>
      </DemoSection>

      <DemoSection code={asElementCode} title="自定义元素">
        <Container as="section" className="border bg-body-tertiary p-3">
          通过 as 渲染为语义化的 section 元素
        </Container>
        <Container as="main" className="border bg-body-tertiary mt-3 p-3">
          通过 as 渲染为语义化的 main 元素
        </Container>
        <p className="mb-0 mt-3 text-muted small">
          通过 as 传入语义化元素，在保留容器样式的同时提升页面可访问性
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex flex-column gap-3">
          <FormSelect
            aria-label="选择容器模式"
            className="w-auto"
            onChange={handleFluidChange}
            value={String(fluid)}
          >
            <option value="false">container</option>
            <option value="true">container-fluid</option>
            <option value="sm">container-sm</option>
            <option value="md">container-md</option>
            <option value="lg">container-lg</option>
            <option value="xl">container-xl</option>
            <option value="xxl">container-xxl</option>
          </FormSelect>
          <Container className="border bg-body-tertiary p-3" fluid={fluid}>
            通过下拉框切换容器模式，观察宽度随视口与断点的变化
          </Container>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的布局容器组件，提供 Container 容器，支持默认定宽、全宽流式与按断点响应的三种模式，可渲染为任意语义化元素，并与 Row / Col 网格组件组合构建页面布局骨架"
      componentName="Container"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={containerProps}
      typeDefinitions={containerTypeDefinitions}
    />
  );
};

export default ContainerDoc;
