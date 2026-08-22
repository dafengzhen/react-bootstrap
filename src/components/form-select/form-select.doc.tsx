import { type ChangeEvent, useState } from 'react';

import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormText } from '../form-control';
import { FormFeedback } from '../form-feedback';
import basicCode from './demos/basic.md?raw';
import disabledCode from './demos/disabled.md?raw';
import htmlSizeCode from './demos/html-size.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import multipleCode from './demos/multiple.md?raw';
import sizingCode from './demos/sizing.md?raw';
import validationCode from './demos/validation.md?raw';
import { FormSelect } from './form-select';
import formSelectPropsTypeCode from './types/form-select-props.md?raw';
import formSelectSizeTypeCode from './types/form-select-size.md?raw';

const formSelectProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '是否禁用下拉选择框，禁用的控件不可聚焦且不参与表单提交',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '原生 `select` 的 `size` 属性，控制在不展开时可见的选项数量，通常配合 `multiple` 使用',
    name: 'htmlSize',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '原生 `id` 属性，用于与 `label` 的 `htmlFor` 关联',
    name: 'id',
    type: 'string',
  },
  {
    defaultValue: 'false',
    description: '是否应用无效状态样式（`is-invalid`），通常配合校验反馈使用',
    name: 'isInvalid',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否应用有效状态样式（`is-valid`）',
    name: 'isValid',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '是否允许多选，多选时按住 Ctrl（Windows）或 Cmd（macOS）键选择多个选项',
    name: 'multiple',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '下拉选择框尺寸，可选 `sm`、`lg`，对应 `form-select-sm`、`form-select-lg`',
    name: 'size',
    type: 'FormSelectSize',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `value`、`defaultValue`、`onChange`、`required` 等）',
    name: '...rest',
    type: 'SelectHTMLAttributes<HTMLSelectElement>',
  },
];

const formSelectTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: formSelectPropsTypeCode,
    description: '下拉选择框组件属性接口',
    name: 'FormSelectProps',
  },
  {
    code: formSelectSizeTypeCode,
    description: '下拉选择框尺寸类型',
    name: 'FormSelectSize',
  },
];

const SELECT_OPTIONS = (
  <>
    <option selected>打开此选择菜单</option>
    <option value="1">选项 1</option>
    <option value="2">选项 2</option>
    <option value="3">选项 3</option>
  </>
);

export const FormSelectDoc = () => {
  const [language, setLanguage] = useState('typescript');

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <FormSelect aria-label="默认下拉选择框示例">{SELECT_OPTIONS}</FormSelect>
      </DemoSection>

      <DemoSection code={sizingCode} title="尺寸">
        <div className="d-flex flex-column gap-3">
          <FormSelect aria-label="大型下拉选择框示例" size="lg">
            {SELECT_OPTIONS}
          </FormSelect>
          <FormSelect aria-label="默认下拉选择框示例">{SELECT_OPTIONS}</FormSelect>
          <FormSelect aria-label="小型下拉选择框示例" size="sm">
            {SELECT_OPTIONS}
          </FormSelect>
        </div>
      </DemoSection>

      <DemoSection code={multipleCode} title="多选">
        <FormSelect aria-label="多选下拉选择框示例" multiple>
          {SELECT_OPTIONS}
        </FormSelect>
        <p className="mb-0 mt-3 text-muted small">
          添加 multiple 属性后，可按住 Ctrl（Windows）或 Cmd（macOS）键选择多个选项
        </p>
      </DemoSection>

      <DemoSection code={htmlSizeCode} title="可见选项数量">
        <FormSelect aria-label="显示三个可见选项的下拉选择框示例" htmlSize={3}>
          {SELECT_OPTIONS}
        </FormSelect>
        <p className="mb-0 mt-3 text-muted small">
          通过 htmlSize 属性控制下拉框在不展开时可见的选项数量
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <FormSelect aria-label="禁用的下拉选择框示例" disabled>
          {SELECT_OPTIONS}
        </FormSelect>
        <p className="mb-0 mt-3 text-muted small">禁用的下拉选择框呈灰色外观且不可交互</p>
      </DemoSection>

      <DemoSection code={validationCode} title="校验状态">
        <div className="d-flex flex-column gap-3">
          <div>
            <FormSelect aria-label="有效的下拉选择框示例" defaultValue="2" isValid>
              <option value="1">选项 1</option>
              <option value="2">选项 2</option>
              <option value="3">选项 3</option>
            </FormSelect>
            <FormFeedback type="valid">看起来不错！</FormFeedback>
          </div>
          <div>
            <FormSelect aria-label="无效的下拉选择框示例" defaultValue="" isInvalid>
              <option value="">请选择一个选项</option>
              <option value="1">选项 1</option>
              <option value="2">选项 2</option>
              <option value="3">选项 3</option>
            </FormSelect>
            <FormFeedback type="invalid">请选择一个选项。</FormFeedback>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 isValid / isInvalid 属性应用 is-valid / is-invalid 校验样式，配合 FormFeedback
          提供有效/无效反馈文本
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div>
          <FormSelect aria-label="选择编程语言" onChange={handleChange} value={language}>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
          </FormSelect>
          <FormText muted>你选择了：{language}</FormText>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的下拉选择框组件，为原生 select 元素提供自定义外观，支持大/小尺寸、多选、可见选项数量、禁用状态及有效/无效校验状态"
      componentName="FormSelect"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={formSelectProps}
      typeDefinitions={formSelectTypeDefinitions}
    />
  );
};

export default FormSelectDoc;
