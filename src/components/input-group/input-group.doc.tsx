import { type ChangeEvent, useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { DropdownButton, DropdownDivider, DropdownItem, SplitButton } from '../dropdown';
import { FormControl, FormText } from '../form-control';
import { FormFeedback } from '../form-feedback';
import { FormSelect } from '../form-select';
import basicCode from './demos/basic.md?raw';
import buttonAddonsCode from './demos/button-addons.md?raw';
import buttonDropdownsCode from './demos/button-dropdowns.md?raw';
import checkboxRadioCode from './demos/checkbox-radio.md?raw';
import customFormsCode from './demos/custom-forms.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import multipleAddonsCode from './demos/multiple-addons.md?raw';
import multipleInputsCode from './demos/multiple-inputs.md?raw';
import segmentedCode from './demos/segmented.md?raw';
import sizingCode from './demos/sizing.md?raw';
import validationCode from './demos/validation.md?raw';
import wrappingCode from './demos/wrapping.md?raw';
import { InputGroup } from './input-group';
import { InputGroupCheckbox } from './input-group-checkbox';
import { InputGroupRadio } from './input-group-radio';
import { InputGroupText } from './input-group-text';
import inputGroupCheckboxPropsTypeCode from './types/input-group-checkbox-props.md?raw';
import inputGroupPropsTypeCode from './types/input-group-props.md?raw';
import inputGroupRadioPropsTypeCode from './types/input-group-radio-props.md?raw';
import inputGroupSizeTypeCode from './types/input-group-size.md?raw';
import inputGroupTextPropsTypeCode from './types/input-group-text-props.md?raw';

const inputGroupProps: ApiProp[] = [
  {
    component: 'InputGroup',
    defaultValue: "'div'",
    description: '渲染的根元素类型，默认渲染 `div`，可传入其他元素或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'InputGroup',
    defaultValue: '-',
    description:
      '输入组内容，通常为 `InputGroupText`、`FormControl`、`Button`、`DropdownButton` 等',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'InputGroup',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'InputGroup',
    defaultValue: 'false',
    description:
      '是否应用 `has-validation` 类，为输入组中的校验反馈（`is-invalid` 与 `invalid-feedback`）预留定位',
    name: 'hasValidation',
    type: 'boolean',
  },
  {
    component: 'InputGroup',
    defaultValue: '-',
    description:
      '输入组尺寸，可选 `sm` 或 `lg`，统一控制组内表单控件与附加元素的尺寸（`input-group-sm`、`input-group-lg`）',
    name: 'size',
    type: 'InputGroupSize',
  },
  {
    component: 'InputGroup',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLDivElement>',
  },
  {
    component: 'InputGroupText',
    defaultValue: "'span'",
    description: '渲染的根元素类型，默认为 `span`，可传入 `label`、`div` 等',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'InputGroupText',
    defaultValue: '-',
    description: '附加元素内容，如 `@`、`$`、`.00` 等文本或图标',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'InputGroupText',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'InputGroupText',
    defaultValue: '-',
    description: '原生 `label` 的 `htmlFor` 属性，配合 `as="label"` 将附加元素与表单控件关联',
    name: 'htmlFor',
    type: 'string',
  },
  {
    component: 'InputGroupText',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `id`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
  {
    component: 'InputGroupCheckbox',
    defaultValue: '-',
    description: '自定义类名，应用于内部的 `form-check-input` 元素',
    name: 'className',
    type: 'string',
  },
  {
    component: 'InputGroupCheckbox',
    defaultValue: '-',
    description:
      '原生 `input` 元素的所有属性（如 `defaultChecked`、`onChange`、`aria-label` 等）；组件自动包裹在 `input-group-text` 中并设置 `type` 为 `checkbox`',
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
  },
  {
    component: 'InputGroupRadio',
    defaultValue: '-',
    description: '自定义类名，应用于内部的 `form-check-input` 元素',
    name: 'className',
    type: 'string',
  },
  {
    component: 'InputGroupRadio',
    defaultValue: '-',
    description:
      '原生 `input` 元素的所有属性（如 `defaultChecked`、`name`、`onChange`、`aria-label` 等）；组件自动包裹在 `input-group-text` 中并设置 `type` 为 `radio`',
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
  },
];

const inputGroupTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: inputGroupPropsTypeCode,
    description: '输入组组件属性接口',
    name: 'InputGroupProps',
  },
  {
    code: inputGroupSizeTypeCode,
    description: '输入组尺寸类型',
    name: 'InputGroupSize',
  },
  {
    code: inputGroupTextPropsTypeCode,
    description: '输入组文本组件属性接口',
    name: 'InputGroupTextProps',
  },
  {
    code: inputGroupCheckboxPropsTypeCode,
    description: '输入组复选框组件属性接口',
    name: 'InputGroupCheckboxProps',
  },
  {
    code: inputGroupRadioPropsTypeCode,
    description: '输入组单选框组件属性接口',
    name: 'InputGroupRadioProps',
  },
];

export const InputGroupDoc = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const isEmpty = value.length === 0;

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div>
          <InputGroup className="mb-3">
            <InputGroupText id="basic-addon1">@</InputGroupText>
            <FormControl
              aria-describedby="basic-addon1"
              aria-label="用户名"
              placeholder="用户名"
              type="text"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              aria-describedby="basic-addon2"
              aria-label="金额"
              placeholder="金额"
              type="text"
            />
            <InputGroupText id="basic-addon2">.00</InputGroupText>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroupText>$</InputGroupText>
            <FormControl aria-label="金额（美元）" type="text" />
            <InputGroupText>.00</InputGroupText>
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={wrappingCode} title="换行">
        <InputGroup className="flex-wrap">
          <InputGroupText>长文本附加元素</InputGroupText>
          <FormControl aria-label="换行示例输入框" type="text" />
          <Button variant="outline-secondary">一个很长的操作按钮</Button>
          <InputGroupText>另一个很长的附加元素文本</InputGroupText>
        </InputGroup>
        <p className="mb-0 mt-3 text-muted small">
          添加 flex-wrap 类后，超长内容会在输入组内部换行而不是溢出
        </p>
      </DemoSection>

      <DemoSection code={sizingCode} title="尺寸">
        <div className="d-flex flex-column gap-3">
          <InputGroup size="sm">
            <InputGroupText id="inputGroup-sizing-sm">小型</InputGroupText>
            <FormControl
              aria-describedby="inputGroup-sizing-sm"
              aria-label="小型输入框示例"
              type="text"
            />
          </InputGroup>
          <InputGroup>
            <InputGroupText id="inputGroup-sizing-default">默认</InputGroupText>
            <FormControl
              aria-describedby="inputGroup-sizing-default"
              aria-label="默认输入框示例"
              type="text"
            />
          </InputGroup>
          <InputGroup size="lg">
            <InputGroupText id="inputGroup-sizing-lg">大型</InputGroupText>
            <FormControl
              aria-describedby="inputGroup-sizing-lg"
              aria-label="大型输入框示例"
              type="text"
            />
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={checkboxRadioCode} title="复选框和单选按钮">
        <div className="d-flex flex-column gap-3">
          <InputGroup>
            <InputGroupCheckbox aria-label="复选框输入组" defaultChecked />
            <FormControl aria-label="复选框输入框" type="text" />
          </InputGroup>
          <InputGroup>
            <InputGroupRadio aria-label="单选框输入组" defaultChecked name="input-group-radio" />
            <FormControl aria-label="单选框输入框" type="text" />
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={multipleInputsCode} title="多个输入框">
        <InputGroup>
          <InputGroupText>姓与名</InputGroupText>
          <FormControl aria-label="名" type="text" />
          <FormControl aria-label="姓" type="text" />
        </InputGroup>
      </DemoSection>

      <DemoSection code={multipleAddonsCode} title="多个附加元素">
        <div className="d-flex flex-column gap-3">
          <InputGroup>
            <InputGroupText>$</InputGroupText>
            <InputGroupText>0.00</InputGroupText>
            <FormControl aria-label="金额输入框（左侧附加元素）" type="text" />
          </InputGroup>
          <InputGroup>
            <FormControl aria-label="金额输入框（右侧附加元素）" type="text" />
            <InputGroupText>$</InputGroupText>
            <InputGroupText>0.00</InputGroupText>
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={buttonAddonsCode} title="按钮附加元素">
        <div className="d-flex flex-column gap-3">
          <InputGroup>
            <Button variant="outline-secondary">按钮</Button>
            <FormControl aria-label="按钮附加元素示例" type="text" />
          </InputGroup>
          <InputGroup>
            <FormControl aria-label="右侧按钮示例" placeholder="搜索内容..." type="text" />
            <Button variant="outline-secondary">搜索</Button>
          </InputGroup>
          <InputGroup>
            <Button variant="outline-secondary">按钮 1</Button>
            <Button variant="outline-secondary">按钮 2</Button>
            <FormControl aria-label="多按钮示例" type="text" />
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={buttonDropdownsCode} title="带下拉菜单的按钮">
        <div className="d-flex flex-column gap-3">
          <InputGroup>
            <DropdownButton
              id="input-dropdown-addon-start"
              title="下拉菜单"
              variant="outline-secondary"
            >
              <DropdownItem>操作</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
              <DropdownItem>还有别的操作</DropdownItem>
              <DropdownDivider />
              <DropdownItem>分离的链接</DropdownItem>
            </DropdownButton>
            <FormControl aria-label="带下拉菜单的输入框" type="text" />
          </InputGroup>
          <InputGroup>
            <FormControl aria-label="右侧下拉菜单输入框" type="text" />
            <DropdownButton
              id="input-dropdown-addon-end"
              title="下拉菜单"
              variant="outline-secondary"
            >
              <DropdownItem>操作</DropdownItem>
              <DropdownItem>另一个操作</DropdownItem>
              <DropdownItem>还有别的操作</DropdownItem>
            </DropdownButton>
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={segmentedCode} title="分割按钮">
        <InputGroup>
          <SplitButton id="input-split-dropdown" title="操作" variant="outline-secondary">
            <DropdownItem>操作</DropdownItem>
            <DropdownItem>另一个操作</DropdownItem>
            <DropdownItem>还有别的操作</DropdownItem>
          </SplitButton>
          <FormControl aria-label="分割按钮输入框" type="text" />
        </InputGroup>
      </DemoSection>

      <DemoSection code={customFormsCode} title="自定义表单">
        <div className="d-flex flex-column gap-3">
          <InputGroup>
            <InputGroupText as="label" htmlFor="inputGroupSelect01">
              选项
            </InputGroupText>
            <FormSelect id="inputGroupSelect01">
              <option selected>选择...</option>
              <option value="1">选项 1</option>
              <option value="2">选项 2</option>
              <option value="3">选项 3</option>
            </FormSelect>
          </InputGroup>
          <InputGroup>
            <FormControl id="inputGroupFile01" type="file" />
            <InputGroupText as="label" htmlFor="inputGroupFile01">
              浏览
            </InputGroupText>
          </InputGroup>
        </div>
      </DemoSection>

      <DemoSection code={validationCode} title="校验状态">
        <InputGroup hasValidation>
          <InputGroupText id="validation-addon">@</InputGroupText>
          <FormControl
            aria-describedby="validation-addon validation-feedback"
            aria-label="带校验反馈的输入框"
            isInvalid
            required
            type="text"
          />
          <FormFeedback id="validation-feedback" type="invalid">
            请填写用户名。
          </FormFeedback>
        </InputGroup>
        <p className="mb-0 mt-3 text-muted small">
          使用 hasValidation 属性后，FormFeedback 会相对整个输入组定位
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="搜索输入框"
              onChange={handleChange}
              placeholder="输入关键词搜索..."
              type="text"
              value={value}
            />
            <Button disabled={isEmpty} variant="primary">
              搜索
            </Button>
          </InputGroup>
          <FormText muted>{isEmpty ? '请输入关键词后再搜索' : `正在搜索：${value}`}</FormText>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的输入组组件，将文本附加元素、按钮、下拉菜单、复选框/单选按钮等与表单控件组合为一个整体，支持前后缀与多个附加元素、多个输入框、按钮与下拉菜单附加、分割按钮、自定义下拉与文件选择、换行、尺寸及校验状态，并配套 InputGroupText、InputGroupCheckbox、InputGroupRadio 子组件"
      componentName="InputGroup"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={inputGroupProps}
      typeDefinitions={inputGroupTypeDefinitions}
    />
  );
};

export default InputGroupDoc;
