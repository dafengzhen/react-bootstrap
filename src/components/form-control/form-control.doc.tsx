import { type ChangeEvent, useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { FormFeedback } from '../form-feedback';
import basicCode from './demos/basic.md?raw';
import colorCode from './demos/color.md?raw';
import datalistsCode from './demos/datalists.md?raw';
import disabledCode from './demos/disabled.md?raw';
import fileCode from './demos/file.md?raw';
import formTextCode from './demos/form-text.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import plaintextCode from './demos/plaintext.md?raw';
import readonlyCode from './demos/readonly.md?raw';
import sizingCode from './demos/sizing.md?raw';
import validationCode from './demos/validation.md?raw';
import { FormControl } from './form-control';
import { FormText } from './form-text';
import formControlElementTypeCode from './types/form-control-element.md?raw';
import formControlPropsTypeCode from './types/form-control-props.md?raw';
import formControlSizeTypeCode from './types/form-control-size.md?raw';
import formTextPropsTypeCode from './types/form-text-props.md?raw';

const formControlProps: ApiProp[] = [
  {
    defaultValue: "'input'",
    description: '渲染的根元素类型，可传入 `textarea`、`select` 或自定义组件以复用表单控件样式',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '是否禁用输入控件，禁用的控件不可聚焦且不参与表单提交',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '原生 `input` 的 `size` 属性，控制以字符为单位的可见宽度',
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
    defaultValue: 'false',
    description: '是否渲染为只读纯文本样式（`form-control-plaintext`），去除边框与背景',
    name: 'plaintext',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '是否只读，只读控件可聚焦但不可编辑',
    name: 'readOnly',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '控件尺寸，可选 `sm`、`lg`，对应 `form-control-sm`、`form-control-lg`（不适用于文件输入）',
    name: 'size',
    type: 'FormControlSize',
  },
  {
    defaultValue: '-',
    description:
      '原生 `input` 的 `type` 属性，如 `text`、`email`、`password`、`file`、`color` 等；为 `color` 时自动附加 `form-control-color`',
    name: 'type',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `placeholder`、`value`、`onChange`、`list` 等）',
    name: '...rest',
    type: 'InputHTMLAttributes',
  },
  {
    component: 'FormText',
    defaultValue: "'small'",
    description: '渲染的根元素类型，默认为 `small`，可传入 `div` 等以渲染块级文本',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'FormText',
    defaultValue: '-',
    description: '帮助文本内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'FormText',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'FormText',
    defaultValue: 'false',
    description: '是否应用静音文字颜色（`text-muted`）',
    name: 'muted',
    type: 'boolean',
  },
  {
    component: 'FormText',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const formControlTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: formControlElementTypeCode,
    description: '表单控件元素类型',
    name: 'FormControlElement',
  },
  {
    code: formControlSizeTypeCode,
    description: '表单控件尺寸类型',
    name: 'FormControlSize',
  },
  {
    code: formControlPropsTypeCode,
    description: '表单控件组件属性接口',
    name: 'FormControlProps',
  },
  {
    code: formTextPropsTypeCode,
    description: '表单文本组件属性接口',
    name: 'FormTextProps',
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FormControlDoc = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const isEmpty = value.length === 0;
  const isValidEmail = EMAIL_PATTERN.test(value);

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <FormControl id="exampleFormControlInput1" placeholder="name@example.com" type="email" />
      </DemoSection>

      <DemoSection code={sizingCode} title="尺寸">
        <div className="d-flex flex-column gap-3">
          <FormControl
            aria-label="大型输入框示例"
            placeholder=".form-control-lg"
            size="lg"
            type="text"
          />
          <FormControl aria-label="默认输入框示例" placeholder="默认输入框" type="text" />
          <FormControl
            aria-label="小型输入框示例"
            placeholder=".form-control-sm"
            size="sm"
            type="text"
          />
        </div>
      </DemoSection>

      <DemoSection code={formTextCode} title="表单文本">
        <div className="row g-3">
          <div className="col-sm-6">
            <label className="form-label" htmlFor="inputPassword5">
              密码
            </label>
            <FormControl aria-describedby="passwordHelpBlock" id="inputPassword5" type="password" />
            <FormText as="div" id="passwordHelpBlock">
              你的密码必须为 8-20 个字符，包含字母和数字，且不能包含空格、特殊字符或表情符号。
            </FormText>
          </div>
          <div className="col-sm-6">
            <label className="form-label" htmlFor="inputPassword6">
              密码
            </label>
            <FormControl
              aria-describedby="passwordHelpInline"
              id="inputPassword6"
              type="password"
            />
            <FormText id="passwordHelpInline" muted>
              建议使用混合大小写字母与数字。
            </FormText>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <div className="d-flex flex-column gap-3">
          <FormControl
            aria-label="禁用的文本输入框"
            disabled
            placeholder="禁用的文本输入框"
            type="text"
          />
          <FormControl
            aria-label="禁用的只读输入框"
            defaultValue="禁用的只读输入框"
            disabled
            readOnly
            type="text"
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          禁用的控件不可聚焦、不响应交互，且不会参与表单提交
        </p>
      </DemoSection>

      <DemoSection code={readonlyCode} title="只读">
        <FormControl
          aria-label="只读输入框示例"
          defaultValue="这个输入框是只读的"
          readOnly
          type="text"
        />
        <p className="mb-0 mt-3 text-muted small">只读控件保留外观样式，可以聚焦但内容不可编辑</p>
      </DemoSection>

      <DemoSection code={plaintextCode} title="只读纯文本">
        <form className="row g-3">
          <div className="col-sm-6">
            <label className="col-form-label" htmlFor="staticEmail">
              邮箱
            </label>
            <FormControl
              defaultValue="email@example.com"
              id="staticEmail"
              plaintext
              readOnly
              type="text"
            />
          </div>
          <div className="col-sm-6">
            <label className="col-form-label" htmlFor="inputPassword">
              密码
            </label>
            <FormControl id="inputPassword" placeholder="请输入密码" type="password" />
          </div>
        </form>
        <p className="mb-0 mt-3 text-muted small">
          使用 plaintext 属性可去除边框与背景，使控件看起来像普通文本
        </p>
      </DemoSection>

      <DemoSection code={fileCode} title="文件输入">
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="form-label" htmlFor="formFile">
              默认文件输入示例
            </label>
            <FormControl id="formFile" type="file" />
          </div>
          <div>
            <label className="form-label" htmlFor="formFileMultiple">
              多文件输入示例
            </label>
            <FormControl id="formFileMultiple" multiple type="file" />
          </div>
          <div>
            <label className="form-label" htmlFor="formFileDisabled">
              禁用文件输入示例
            </label>
            <FormControl disabled id="formFileDisabled" type="file" />
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          文件输入不支持尺寸类（form-control-sm / form-control-lg）
        </p>
      </DemoSection>

      <DemoSection code={colorCode} title="颜色输入">
        <FormControl defaultValue="#563d7c" id="exampleColorInput" title="选择颜色" type="color" />
        <p className="mb-0 mt-3 text-muted small">type 为 color 时自动附加 form-control-color 类</p>
      </DemoSection>

      <DemoSection code={datalistsCode} title="数据列表">
        <FormControl
          aria-label="数据列表示例"
          list="datalistOptions"
          placeholder="输入以搜索..."
          type="text"
        />
        {/* oxlint-disable jsx-a11y/control-has-associated-label */}
        <datalist id="datalistOptions">
          <option value="San Francisco" />
          <option value="New York" />
          <option value="Seattle" />
          <option value="Los Angeles" />
          <option value="Chicago" />
        </datalist>
        {/* oxlint-enable jsx-a11y/control-has-associated-label */}
      </DemoSection>

      <DemoSection code={validationCode} title="校验状态">
        <div className="d-flex flex-column gap-3">
          <div>
            <FormControl aria-label="有效输入示例" isValid placeholder="有效输入" type="text" />
            <FormFeedback type="valid">看起来不错！</FormFeedback>
          </div>
          <div>
            <FormControl aria-label="无效输入示例" isInvalid placeholder="无效输入" type="text" />
            <FormFeedback type="invalid">请输入内容。</FormFeedback>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 isValid / isInvalid 属性应用 is-valid / is-invalid 校验样式，配合 FormFeedback
          提供有效/无效反馈文本
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div>
          <FormControl
            aria-label="邮箱输入框"
            isInvalid={!isEmpty && !isValidEmail}
            isValid={!isEmpty && isValidEmail}
            onChange={handleChange}
            placeholder="输入邮箱地址"
            type="email"
            value={value}
          />
          <FormText muted>
            {isEmpty ? '请输入邮箱地址' : isValidEmail ? '邮箱格式正确' : '邮箱格式不正确'}
          </FormText>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的表单控件组件，为 input、select、textarea 等元素提供统一的表单控件样式，支持尺寸、禁用、只读、只读纯文本、文件与颜色输入、数据列表及有效/无效校验状态，并配套 FormText 表单帮助文本组件"
      componentName="FormControl"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={formControlProps}
      typeDefinitions={formControlTypeDefinitions}
    />
  );
};

export default FormControlDoc;
