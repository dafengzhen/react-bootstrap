import { type ChangeEvent, useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { FormControl, FormText } from '../form-control';
import { FormFeedback } from '../form-feedback';
import { FormSelect } from '../form-select';
import { InputGroup, InputGroupText } from '../input-group';
import basicCode from './demos/basic.md?raw';
import disabledCode from './demos/disabled.md?raw';
import inputGroupCode from './demos/input-group.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import layoutCode from './demos/layout.md?raw';
import plaintextCode from './demos/plaintext.md?raw';
import selectCode from './demos/select.md?raw';
import textareaCode from './demos/textarea.md?raw';
import validationCode from './demos/validation.md?raw';
import valueCode from './demos/value.md?raw';
import { FloatingLabel } from './floating-label';
import floatingLabelPropsTypeCode from './types/floating-label-props.md?raw';

const floatingLabelProps: ApiProp[] = [
  {
    defaultValue: "'div'",
    description: '渲染的根元素类型，默认渲染 `div`，可传入其他元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '浮动标签内容，通常为 `FormControl` 或 `FormSelect` 表单控件',
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
    description: '表单控件的 `id`，同时用于内部 `label` 的 `htmlFor` 关联',
    name: 'controlId',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '浮动标签文本，渲染在表单控件之后的 `label` 元素中',
    name: 'label',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
];

const floatingLabelTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: floatingLabelPropsTypeCode,
    description: '浮动标签组件属性接口',
    name: 'FloatingLabelProps',
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

export const FloatingLabelDoc = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const isEmpty = value.length === 0;

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div className="d-flex flex-column gap-3">
          <FloatingLabel controlId="floatingBasicInput" label="邮箱地址">
            <FormControl placeholder="name@example.com" type="email" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingBasicPassword" label="密码">
            <FormControl placeholder="密码" type="password" />
          </FloatingLabel>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          将 FormControl 与 label 包裹在 FloatingLabel 中即可启用浮动标签，注意输入框需要提供
          placeholder
        </p>
      </DemoSection>

      <DemoSection code={valueCode} title="默认值">
        <FloatingLabel controlId="floatingValueInput" label="带默认值的输入框">
          <FormControl
            defaultValue="test@example.com"
            placeholder="name@example.com"
            type="email"
          />
        </FloatingLabel>
        <p className="mb-0 mt-3 text-muted small">输入框已有值时，标签会自动保持浮起状态</p>
      </DemoSection>

      <DemoSection code={textareaCode} title="文本域">
        <div className="d-flex flex-column gap-3">
          <FloatingLabel controlId="floatingTextarea" label="评论">
            <FormControl as="textarea" placeholder="在此留言" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingTextarea2" label="自定义高度的评论">
            <FormControl as="textarea" placeholder="在此留言" style={{ height: 100 }} />
          </FloatingLabel>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 FormControl 的 as 属性渲染文本域；自定义高度时建议使用 style 而不是 rows 属性
        </p>
      </DemoSection>

      <DemoSection code={selectCode} title="下拉选择框">
        <FloatingLabel controlId="floatingSelect" label="可用于下拉选择框">
          <FormSelect aria-label="浮动标签下拉选择框示例">{SELECT_OPTIONS}</FormSelect>
        </FloatingLabel>
        <p className="mb-0 mt-3 text-muted small">
          除 FormControl 外，浮动标签仅支持
          FormSelect；与输入框不同，下拉选择框的标签始终保持浮起状态
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <div className="d-flex flex-column gap-3">
          <FloatingLabel controlId="floatingInputDisabled" label="禁用的输入框">
            <FormControl disabled placeholder="name@example.com" type="text" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingTextareaDisabled" label="禁用的文本域">
            <FormControl as="textarea" disabled placeholder="在此留言" style={{ height: 100 }} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingSelectDisabled" label="禁用的下拉选择框">
            <FormSelect aria-label="禁用的浮动标签下拉选择框示例" disabled>
              {SELECT_OPTIONS}
            </FormSelect>
          </FloatingLabel>
        </div>
        <p className="mb-0 mt-3 text-muted small">禁用的控件呈灰色外观且不可交互</p>
      </DemoSection>

      <DemoSection code={plaintextCode} title="只读纯文本">
        <div className="d-flex flex-column gap-3">
          <FloatingLabel controlId="floatingEmptyPlaintextInput" label="空输入框">
            <FormControl placeholder="name@example.com" plaintext readOnly type="email" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPlaintextInput" label="带默认值的输入框">
            <FormControl
              defaultValue="name@example.com"
              placeholder="name@example.com"
              plaintext
              readOnly
              type="email"
            />
          </FloatingLabel>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          浮动标签同样支持 form-control-plaintext 只读纯文本样式
        </p>
      </DemoSection>

      <DemoSection code={inputGroupCode} title="输入组">
        <div className="d-flex flex-column gap-3">
          <InputGroup>
            <InputGroupText>@</InputGroupText>
            <FloatingLabel controlId="floatingInputGroup1" label="用户名">
              <FormControl placeholder="用户名" type="text" />
            </FloatingLabel>
          </InputGroup>
          <InputGroup hasValidation>
            <InputGroupText>@</InputGroupText>
            <FloatingLabel controlId="floatingInputGroup2" label="用户名">
              <FormControl
                aria-describedby="floatingInputGroup2Feedback"
                isInvalid
                placeholder="用户名"
                required
                type="text"
              />
            </FloatingLabel>
            <FormFeedback id="floatingInputGroup2Feedback" type="invalid">
              请选择一个用户名。
            </FormFeedback>
          </InputGroup>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          将 FloatingLabel 放在 InputGroup 内部即可组合使用；同时使用校验反馈时，需要为输入组添加
          hasValidation 属性
        </p>
      </DemoSection>

      <DemoSection code={validationCode} title="校验状态">
        <div className="d-flex flex-column gap-3">
          <div>
            <FloatingLabel controlId="floatingInputValid" label="有效的输入框">
              <FormControl
                defaultValue="test@example.com"
                isValid
                placeholder="name@example.com"
                type="email"
              />
            </FloatingLabel>
            <FormFeedback type="valid">看起来不错！</FormFeedback>
          </div>
          <div>
            <FloatingLabel controlId="floatingInputInvalid" label="无效的输入框">
              <FormControl
                defaultValue="test@example.com"
                isInvalid
                placeholder="name@example.com"
                type="email"
              />
            </FloatingLabel>
            <FormFeedback type="invalid">请输入有效的邮箱地址。</FormFeedback>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 isValid / isInvalid 属性应用校验样式，浮动标签同样会适配边框颜色
        </p>
      </DemoSection>

      <DemoSection code={layoutCode} title="网格布局">
        <div className="row g-2">
          <div className="col-md">
            <FloatingLabel controlId="floatingInputGrid" label="邮箱地址">
              <FormControl
                defaultValue="mdo@example.com"
                placeholder="name@example.com"
                type="email"
              />
            </FloatingLabel>
          </div>
          <div className="col-md">
            <FloatingLabel controlId="floatingSelectGrid" label="可用于下拉选择框">
              <FormSelect aria-label="布局浮动标签下拉选择框示例">{SELECT_OPTIONS}</FormSelect>
            </FloatingLabel>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          与 Bootstrap 网格系统配合使用时，将表单元素放置在列（col-*）类中
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div>
          <FloatingLabel controlId="floatingInteractive" label="用户名">
            <FormControl
              onChange={handleChange}
              placeholder="请输入用户名"
              type="text"
              value={value}
            />
          </FloatingLabel>
          <FormText muted>{isEmpty ? '输入内容后标签会自动浮起' : `当前值：${value}`}</FormText>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的浮动标签组件，将标签浮动在输入框上方以节省空间，支持输入框、文本域、下拉选择框、禁用与只读纯文本状态、输入组组合、校验状态及网格布局"
      componentName="FloatingLabel"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={floatingLabelProps}
      typeDefinitions={floatingLabelTypeDefinitions}
    />
  );
};

export default FloatingLabelDoc;
