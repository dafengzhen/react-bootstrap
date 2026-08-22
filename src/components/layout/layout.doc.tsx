import clsx from 'clsx';
import { type ChangeEvent, useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import { FormCheck, FormCheckInput, FormCheckLabel } from '../form-check';
import { FormControl } from '../form-control';
import { FormSelect } from '../form-select';
import { InputGroup, InputGroupText } from '../input-group';
import { Col } from './col';
import autoSizingMixedCode from './demos/auto-sizing-mixed.md?raw';
import autoSizingCode from './demos/auto-sizing.md?raw';
import columnSizingCode from './demos/column-sizing.md?raw';
import formGridCode from './demos/form-grid.md?raw';
import gridFormCode from './demos/grid-form.md?raw';
import guttersCode from './demos/gutters.md?raw';
import horizontalFormCode from './demos/horizontal-form.md?raw';
import inlineFormsCode from './demos/inline-forms.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import labelSizingCode from './demos/label-sizing.md?raw';
import { FormLabel } from './form-label';
import { Row } from './row';
import colOrderTypeCode from './types/col-order.md?raw';
import colPropsTypeCode from './types/col-props.md?raw';
import colSizeObjectTypeCode from './types/col-size-object.md?raw';
import colSizeTypeCode from './types/col-size.md?raw';
import colSpanTypeCode from './types/col-span.md?raw';
import formLabelColumnTypeCode from './types/form-label-column.md?raw';
import formLabelPropsTypeCode from './types/form-label-props.md?raw';
import rowColsTypeCode from './types/row-cols.md?raw';
import rowPropsTypeCode from './types/row-props.md?raw';

const layoutProps: ApiProp[] = [
  {
    component: 'Row',
    defaultValue: "'div'",
    description: '渲染的根元素类型，默认渲染 `div`，可传入 `form`、`fieldset` 等元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description:
      '自定义类名，可通过 `g-*`、`gx-*`、`gy-*` 等间距工具类以及 `align-items-*` 对齐工具类组合布局',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '`lg` 及以上断点的每行最大列数，对应 `row-cols-lg-*`',
    name: 'lg',
    type: 'RowCols',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '`md` 及以上断点的每行最大列数，对应 `row-cols-md-*`',
    name: 'md',
    type: 'RowCols',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '`sm` 及以上断点的每行最大列数，对应 `row-cols-sm-*`',
    name: 'sm',
    type: 'RowCols',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '`xl` 及以上断点的每行最大列数，对应 `row-cols-xl-*`',
    name: 'xl',
    type: 'RowCols',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '默认断点的每行最大列数，对应 `row-cols-*`，如 2 或 `auto`',
    name: 'xs',
    type: 'RowCols',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '`xxl` 及以上断点的每行最大列数，对应 `row-cols-xxl-*`',
    name: 'xxl',
    type: 'RowCols',
  },
  {
    component: 'Row',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
  {
    component: 'Col',
    defaultValue: "'div'",
    description: '渲染的根元素类型，默认渲染 `div`，可传入其他元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '`lg` 及以上断点的列宽，对应 `col-lg-*`、`offset-lg-*`、`order-lg-*`',
    name: 'lg',
    type: 'ColSize',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '`md` 及以上断点的列宽，对应 `col-md-*`、`offset-md-*`、`order-md-*`',
    name: 'md',
    type: 'ColSize',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '`sm` 及以上断点的列宽，对应 `col-sm-*`、`offset-sm-*`、`order-sm-*`',
    name: 'sm',
    type: 'ColSize',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '`xl` 及以上断点的列宽，对应 `col-xl-*`、`offset-xl-*`、`order-xl-*`',
    name: 'xl',
    type: 'ColSize',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description:
      '默认断点的列宽，对应 `col-*`、`offset-*`、`order-*`，如 7、`auto`、true 或 `{ span, offset, order }`',
    name: 'xs',
    type: 'ColSize',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '`xxl` 及以上断点的列宽，对应 `col-xxl-*`、`offset-xxl-*`、`order-xxl-*`',
    name: 'xxl',
    type: 'ColSize',
  },
  {
    component: 'Col',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
  {
    component: 'FormLabel',
    defaultValue: "'label'",
    description: '渲染的根元素类型，默认渲染 `label`，可传入 `legend` 等元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '标签文本内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'FormLabel',
    defaultValue: 'false',
    description:
      '是否为水平表单的列标签（`col-form-label`），传入 `sm` 或 `lg` 时追加 `col-form-label-sm` / `col-form-label-lg` 尺寸类',
    name: 'column',
    type: 'FormLabelColumn',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '原生 `for` 属性，关联表单控件的 `id`',
    name: 'htmlFor',
    type: 'string',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '`column` 为真时标签的 `lg` 及以上断点列宽，对应 `col-lg-*`',
    name: 'lg',
    type: 'ColSize',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '`column` 为真时标签的 `md` 及以上断点列宽，对应 `col-md-*`',
    name: 'md',
    type: 'ColSize',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '`column` 为真时标签的 `sm` 及以上断点列宽，对应 `col-sm-*`',
    name: 'sm',
    type: 'ColSize',
  },
  {
    component: 'FormLabel',
    defaultValue: 'false',
    description: '是否应用视觉隐藏样式（`visually-hidden`），为屏幕阅读器保留可访问的标签',
    name: 'visuallyHidden',
    type: 'boolean',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '`column` 为真时标签的 `xl` 及以上断点列宽，对应 `col-xl-*`',
    name: 'xl',
    type: 'ColSize',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '`column` 为真时标签的默认断点列宽，对应 `col-*`',
    name: 'xs',
    type: 'ColSize',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '`column` 为真时标签的 `xxl` 及以上断点列宽，对应 `col-xxl-*`',
    name: 'xxl',
    type: 'ColSize',
  },
  {
    component: 'FormLabel',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `onClick`、`aria-*` 等）',
    name: '...rest',
    type: 'LabelHTMLAttributes<HTMLLabelElement>',
  },
];

const layoutTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: colOrderTypeCode,
    description: '网格列排序类型',
    name: 'ColOrder',
  },
  {
    code: colPropsTypeCode,
    description: '网格列组件属性接口',
    name: 'ColProps',
  },
  {
    code: colSizeTypeCode,
    description: '网格列宽类型',
    name: 'ColSize',
  },
  {
    code: colSizeObjectTypeCode,
    description: '网格列宽对象类型',
    name: 'ColSizeObject',
  },
  {
    code: colSpanTypeCode,
    description: '网格列跨度类型',
    name: 'ColSpan',
  },
  {
    code: formLabelColumnTypeCode,
    description: '表单标签列类型',
    name: 'FormLabelColumn',
  },
  {
    code: formLabelPropsTypeCode,
    description: '表单标签组件属性接口',
    name: 'FormLabelProps',
  },
  {
    code: rowColsTypeCode,
    description: '每行列数类型',
    name: 'RowCols',
  },
  {
    code: rowPropsTypeCode,
    description: '网格行组件属性接口',
    name: 'RowProps',
  },
];

export const LayoutDoc = () => {
  const [centered, setCentered] = useState(true);
  const [gutter, setGutter] = useState('g-3');

  const handleCenteredChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCentered(event.target.checked);
  };

  const handleGutterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setGutter(event.target.value);
  };

  const demoContent = (
    <>
      <DemoSection code={formGridCode} title="表单网格">
        <Row>
          <Col>
            <FormControl aria-label="名" placeholder="名" />
          </Col>
          <Col>
            <FormControl aria-label="姓" placeholder="姓" />
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          使用 Row / Col 组件构建多列表单网格，各列自动均分可用宽度
        </p>
      </DemoSection>

      <DemoSection code={guttersCode} title="间距">
        <Row className="g-3">
          <Col>
            <FormControl aria-label="名" placeholder="名" />
          </Col>
          <Col>
            <FormControl aria-label="姓" placeholder="姓" />
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          通过 className 传入 `g-3` 等间距修饰类，可同时控制水平与垂直方向的列间距
        </p>
      </DemoSection>

      <DemoSection code={gridFormCode} title="网格表单">
        <Row as="form" className="g-3">
          <Col md={6}>
            <FormLabel htmlFor="layoutGridEmail">邮箱</FormLabel>
            <FormControl id="layoutGridEmail" type="email" />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="layoutGridPassword">密码</FormLabel>
            <FormControl id="layoutGridPassword" type="password" />
          </Col>
          <Col xs={12}>
            <FormLabel htmlFor="layoutGridAddress">地址</FormLabel>
            <FormControl id="layoutGridAddress" placeholder="1234 主街" />
          </Col>
          <Col xs={12}>
            <FormLabel htmlFor="layoutGridAddress2">地址 2</FormLabel>
            <FormControl id="layoutGridAddress2" placeholder="公寓、工作室或楼层" />
          </Col>
          <Col md={6}>
            <FormLabel htmlFor="layoutGridCity">城市</FormLabel>
            <FormControl id="layoutGridCity" />
          </Col>
          <Col md={4}>
            <FormLabel htmlFor="layoutGridState">省份</FormLabel>
            <FormSelect id="layoutGridState">
              <option selected>请选择...</option>
              <option>...</option>
            </FormSelect>
          </Col>
          <Col md={2}>
            <FormLabel htmlFor="layoutGridZip">邮编</FormLabel>
            <FormControl id="layoutGridZip" />
          </Col>
          <Col xs={12}>
            <FormCheck>
              <FormCheckInput id="layoutGridCheck" />
              <FormCheckLabel htmlFor="layoutGridCheck">勾选我</FormCheckLabel>
            </FormCheck>
          </Col>
          <Col xs={12}>
            <Button type="submit" variant="primary">
              登录
            </Button>
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          结合不同断点的列宽与 FormLabel、FormControl、FormSelect 等表单组件，构建完整的网格表单
        </p>
      </DemoSection>

      <DemoSection code={horizontalFormCode} title="水平表单">
        <form>
          <Row className="mb-3">
            <FormLabel column htmlFor="layoutHorizontalEmail" sm={2}>
              邮箱
            </FormLabel>
            <Col sm={10}>
              <FormControl id="layoutHorizontalEmail" type="email" />
            </Col>
          </Row>
          <Row className="mb-3">
            <FormLabel column htmlFor="layoutHorizontalPassword" sm={2}>
              密码
            </FormLabel>
            <Col sm={10}>
              <FormControl id="layoutHorizontalPassword" type="password" />
            </Col>
          </Row>
          <Row as="fieldset" className="mb-3">
            <FormLabel as="legend" className="pt-0" column sm={2}>
              单选按钮
            </FormLabel>
            <Col sm={10}>
              <FormCheck>
                <FormCheckInput
                  defaultChecked
                  id="layoutHorizontalRadio1"
                  name="layoutHorizontalRadios"
                  type="radio"
                />
                <FormCheckLabel htmlFor="layoutHorizontalRadio1">第一个单选</FormCheckLabel>
              </FormCheck>
              <FormCheck>
                <FormCheckInput
                  id="layoutHorizontalRadio2"
                  name="layoutHorizontalRadios"
                  type="radio"
                />
                <FormCheckLabel htmlFor="layoutHorizontalRadio2">第二个单选</FormCheckLabel>
              </FormCheck>
              <FormCheck className="disabled">
                <FormCheckInput
                  disabled
                  id="layoutHorizontalRadio3"
                  name="layoutHorizontalRadios"
                  type="radio"
                />
                <FormCheckLabel htmlFor="layoutHorizontalRadio3">第三个禁用单选</FormCheckLabel>
              </FormCheck>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={{ offset: 2, span: 10 }}>
              <FormCheck>
                <FormCheckInput id="layoutHorizontalCheck" />
                <FormCheckLabel htmlFor="layoutHorizontalCheck">示例复选框</FormCheckLabel>
              </FormCheck>
            </Col>
          </Row>
          <Button type="submit" variant="primary">
            登录
          </Button>
        </form>
        <p className="mb-0 mt-3 text-muted small">
          为 FormLabel 设置 column 属性可应用 `col-form-label`，使标签与其关联控件垂直居中对齐
        </p>
      </DemoSection>

      <DemoSection code={labelSizingCode} level={3} title="水平表单标签尺寸">
        <Row className="mb-3">
          <FormLabel column="sm" htmlFor="layoutLabelSm" sm={2}>
            邮箱
          </FormLabel>
          <Col sm={10}>
            <FormControl
              id="layoutLabelSm"
              placeholder="col-form-label-sm"
              size="sm"
              type="email"
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <FormLabel column htmlFor="layoutLabelDefault" sm={2}>
            邮箱
          </FormLabel>
          <Col sm={10}>
            <FormControl id="layoutLabelDefault" placeholder="col-form-label" type="email" />
          </Col>
        </Row>
        <Row>
          <FormLabel column="lg" htmlFor="layoutLabelLg" sm={2}>
            邮箱
          </FormLabel>
          <Col sm={10}>
            <FormControl
              id="layoutLabelLg"
              placeholder="col-form-label-lg"
              size="lg"
              type="email"
            />
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          column 传入 `sm` 或 `lg` 时追加 `col-form-label-sm` /
          `col-form-label-lg`，与对应尺寸的控件保持一致
        </p>
      </DemoSection>

      <DemoSection code={columnSizingCode} title="列宽">
        <Row className="g-3">
          <Col sm={7}>
            <FormControl aria-label="城市" placeholder="城市" />
          </Col>
          <Col sm>
            <FormControl aria-label="省份" placeholder="省份" />
          </Col>
          <Col sm>
            <FormControl aria-label="邮编" placeholder="邮编" />
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          指定部分列的宽度（如 sm={7}），其余列自动均分剩余空间
        </p>
      </DemoSection>

      <DemoSection code={autoSizingCode} title="自动宽度">
        <Row as="form" className="align-items-center gx-3 gy-2">
          <Col xs="auto">
            <FormLabel htmlFor="layoutAutoInput" visuallyHidden>
              姓名
            </FormLabel>
            <FormControl id="layoutAutoInput" placeholder="张三" />
          </Col>
          <Col xs="auto">
            <FormLabel htmlFor="layoutAutoInputGroup" visuallyHidden>
              用户名
            </FormLabel>
            <InputGroup>
              <InputGroupText>@</InputGroupText>
              <FormControl id="layoutAutoInputGroup" placeholder="用户名" />
            </InputGroup>
          </Col>
          <Col xs="auto">
            <FormLabel htmlFor="layoutAutoSelect" visuallyHidden>
              偏好
            </FormLabel>
            <FormSelect id="layoutAutoSelect">
              <option selected>请选择...</option>
              <option value="1">选项 1</option>
              <option value="2">选项 2</option>
              <option value="3">选项 3</option>
            </FormSelect>
          </Col>
          <Col xs="auto">
            <FormCheck>
              <FormCheckInput id="layoutAutoCheck" />
              <FormCheckLabel htmlFor="layoutAutoCheck">记住我</FormCheckLabel>
            </FormCheck>
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">
              提交
            </Button>
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          设置 xs="auto" 使列宽随内容收缩，配合 `align-items-center` 将各控件垂直居中
        </p>
      </DemoSection>

      <DemoSection code={autoSizingMixedCode} level={3} title="自动宽度与固定列宽混合">
        <Row as="form" className="align-items-center gx-3 gy-2">
          <Col sm={3}>
            <FormLabel htmlFor="layoutMixedName" visuallyHidden>
              姓名
            </FormLabel>
            <FormControl id="layoutMixedName" placeholder="张三" />
          </Col>
          <Col sm={3}>
            <FormLabel htmlFor="layoutMixedUsername" visuallyHidden>
              用户名
            </FormLabel>
            <InputGroup>
              <InputGroupText>@</InputGroupText>
              <FormControl id="layoutMixedUsername" placeholder="用户名" />
            </InputGroup>
          </Col>
          <Col sm={3}>
            <FormLabel htmlFor="layoutMixedSelect" visuallyHidden>
              偏好
            </FormLabel>
            <FormSelect id="layoutMixedSelect">
              <option selected>请选择...</option>
              <option value="1">选项 1</option>
              <option value="2">选项 2</option>
              <option value="3">选项 3</option>
            </FormSelect>
          </Col>
          <Col xs="auto">
            <FormCheck>
              <FormCheckInput id="layoutMixedCheck" />
              <FormCheckLabel htmlFor="layoutMixedCheck">记住我</FormCheckLabel>
            </FormCheck>
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">
              提交
            </Button>
          </Col>
        </Row>
      </DemoSection>

      <DemoSection code={inlineFormsCode} title="行内表单">
        <Row as="form" className="align-items-center g-3" lg="auto">
          <Col xs={12}>
            <FormLabel htmlFor="layoutInlineUsername" visuallyHidden>
              用户名
            </FormLabel>
            <InputGroup>
              <InputGroupText>@</InputGroupText>
              <FormControl id="layoutInlineUsername" placeholder="用户名" />
            </InputGroup>
          </Col>
          <Col xs={12}>
            <FormLabel htmlFor="layoutInlineSelect" visuallyHidden>
              偏好
            </FormLabel>
            <FormSelect id="layoutInlineSelect">
              <option selected>请选择...</option>
              <option value="1">选项 1</option>
              <option value="2">选项 2</option>
              <option value="3">选项 3</option>
            </FormSelect>
          </Col>
          <Col xs={12}>
            <FormCheck>
              <FormCheckInput id="layoutInlineCheck" />
              <FormCheckLabel htmlFor="layoutInlineCheck">记住我</FormCheckLabel>
            </FormCheck>
          </Col>
          <Col xs={12}>
            <Button type="submit" variant="primary">
              提交
            </Button>
          </Col>
        </Row>
        <p className="mb-0 mt-3 text-muted small">
          lg="auto" 生成 `row-cols-lg-auto`，在 lg 断点以上横向排列，窄屏下各控件以 xs={12} 纵向堆叠
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex flex-wrap gap-3">
            <FormSelect
              aria-label="选择间距尺寸"
              className="w-auto"
              onChange={handleGutterChange}
              value={gutter}
            >
              <option value="g-0">g-0</option>
              <option value="g-1">g-1</option>
              <option value="g-2">g-2</option>
              <option value="g-3">g-3</option>
              <option value="g-4">g-4</option>
              <option value="g-5">g-5</option>
            </FormSelect>
            <FormCheck>
              <FormCheckInput
                checked={centered}
                id="layoutInteractiveCentered"
                onChange={handleCenteredChange}
                type="checkbox"
              />
              <FormCheckLabel htmlFor="layoutInteractiveCentered">
                垂直居中（align-items-center）
              </FormCheckLabel>
            </FormCheck>
          </div>
          <Row className={clsx(gutter, centered && 'align-items-center')}>
            <Col sm={4}>
              <FormControl aria-label="城市" placeholder="城市" />
            </Col>
            <Col sm={4}>
              <FormControl aria-label="省份" placeholder="省份" />
            </Col>
            <Col sm={4}>
              <FormCheck>
                <FormCheckInput id="layoutInteractiveCheck" />
                <FormCheckLabel htmlFor="layoutInteractiveCheck">记住我</FormCheckLabel>
              </FormCheck>
            </Col>
          </Row>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的表单布局组件，提供 Row 网格行、Col 网格列与 FormLabel 表单标签，支持多列表单网格、水平表单、列宽与自动宽度、行内表单及间距与对齐控制，用于从行内到水平到自定义网格的表单布局实现"
      componentName="Layout"
      componentTags={['基础', '表单', '布局']}
      demoContent={demoContent}
      props={layoutProps}
      typeDefinitions={layoutTypeDefinitions}
    />
  );
};

export default LayoutDoc;
