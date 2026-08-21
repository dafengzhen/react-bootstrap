import { type ChangeEvent, useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import basicCode from './demos/basic.md?raw';
import disabledRadiosCode from './demos/disabled-radios.md?raw';
import disabledCode from './demos/disabled.md?raw';
import indeterminateCode from './demos/indeterminate.md?raw';
import inlineCode from './demos/inline.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import radiosCode from './demos/radios.md?raw';
import reverseCode from './demos/reverse.md?raw';
import switchesCode from './demos/switches.md?raw';
import validationCode from './demos/validation.md?raw';
import withoutLabelsCode from './demos/without-labels.md?raw';
import { FormCheck } from './form-check';
import { FormCheckInput } from './form-check-input';
import { FormCheckLabel } from './form-check-label';
import formCheckInputPropsTypeCode from './types/form-check-input-props.md?raw';
import formCheckLabelPropsTypeCode from './types/form-check-label-props.md?raw';
import formCheckPropsTypeCode from './types/form-check-props.md?raw';
import formCheckTypeTypeCode from './types/form-check-type.md?raw';

const formCheckProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '子元素，通常为 FormCheckInput 与 FormCheckLabel 的组合',
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
    defaultValue: 'false',
    description: '是否应用行内布局（`form-check-inline`），使多个复选或单选控件水平排列',
    name: 'inline',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否应用反向布局（`form-check-reverse`），将输入框与标签位置互换',
    name: 'reverse',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '控件类型，可选 `checkbox`、`radio`、`switch`；为 `switch` 时附加 `form-switch` 类以渲染开关样式',
    name: 'type',
    type: 'FormCheckType',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `onClick`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLDivElement>',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '原生 `checked` 属性，受控选中状态',
    name: 'checked',
    type: 'boolean',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '原生 `defaultChecked` 属性，非受控的默认选中状态',
    name: 'defaultChecked',
    type: 'boolean',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '是否禁用输入框，关联的标签会自动呈现较浅的颜色',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '原生 `id` 属性，用于与 `label` 的 `htmlFor` 关联',
    name: 'id',
    type: 'string',
  },
  {
    component: 'FormCheckInput',
    defaultValue: 'false',
    description: '是否设置不确定（半选中）状态，通过回调 ref 设置原生 `indeterminate` 属性实现',
    name: 'indeterminate',
    type: 'boolean',
  },
  {
    component: 'FormCheckInput',
    defaultValue: 'false',
    description: '是否应用无效状态样式（`is-invalid`），通常配合校验反馈使用',
    name: 'isInvalid',
    type: 'boolean',
  },
  {
    component: 'FormCheckInput',
    defaultValue: 'false',
    description: '是否应用有效状态样式（`is-valid`）',
    name: 'isValid',
    type: 'boolean',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '原生 `name` 属性，同名的单选按钮互斥',
    name: 'name',
    type: 'string',
  },
  {
    component: 'FormCheckInput',
    defaultValue: "'checkbox'",
    description: '输入框类型，可选 `checkbox`、`radio`',
    name: 'type',
    type: "'checkbox' | 'radio'",
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '原生 `value` 属性',
    name: 'value',
    type: 'string',
  },
  {
    component: 'FormCheckInput',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `onChange`、`role`、`required` 等）',
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
  },
  {
    component: 'FormCheckLabel',
    defaultValue: '-',
    description: '标签内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'FormCheckLabel',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'FormCheckLabel',
    defaultValue: '-',
    description: '原生 `for` 属性，关联对应输入框的 `id`',
    name: 'htmlFor',
    type: 'string',
  },
  {
    component: 'FormCheckLabel',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `onClick`、`aria-*` 等）',
    name: '...rest',
    type: 'LabelHTMLAttributes<HTMLLabelElement>',
  },
];

const formCheckTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: formCheckInputPropsTypeCode,
    description: '复选/单选输入框组件属性接口',
    name: 'FormCheckInputProps',
  },
  {
    code: formCheckLabelPropsTypeCode,
    description: '复选/单选标签组件属性接口',
    name: 'FormCheckLabelProps',
  },
  {
    code: formCheckPropsTypeCode,
    description: '复选/单选容器组件属性接口',
    name: 'FormCheckProps',
  },
  {
    code: formCheckTypeTypeCode,
    description: '复选/单选控件类型',
    name: 'FormCheckType',
  },
];

export const FormCheckDoc = () => {
  const [checked, setChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');
  const [switched, setSwitched] = useState(false);

  const handleCheckedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleRadioValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  const handleSwitchedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSwitched(event.target.checked);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <FormCheck>
          <FormCheckInput id="checkDefault" />
          <FormCheckLabel htmlFor="checkDefault">默认复选框</FormCheckLabel>
        </FormCheck>
        <FormCheck>
          <FormCheckInput defaultChecked id="checkChecked" />
          <FormCheckLabel htmlFor="checkChecked">已选中的复选框</FormCheckLabel>
        </FormCheck>
      </DemoSection>

      <DemoSection code={indeterminateCode} title="不确定状态">
        <FormCheck>
          <FormCheckInput id="checkIndeterminate" indeterminate />
          <FormCheckLabel htmlFor="checkIndeterminate">不确定状态的复选框</FormCheckLabel>
        </FormCheck>
        <p className="mb-0 mt-3 text-muted small">
          通过 indeterminate 属性设置原生 indeterminate 状态，常用于「全选」场景的部分选中状态
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <FormCheck>
          <FormCheckInput disabled id="checkDisabled" />
          <FormCheckLabel htmlFor="checkDisabled">禁用的复选框</FormCheckLabel>
        </FormCheck>
        <FormCheck>
          <FormCheckInput defaultChecked disabled id="checkCheckedDisabled" />
          <FormCheckLabel htmlFor="checkCheckedDisabled">禁用且已选中的复选框</FormCheckLabel>
        </FormCheck>
        <p className="mb-0 mt-3 text-muted small">
          添加 disabled 属性后，关联的标签会自动呈现较浅的颜色以提示输入框状态
        </p>
      </DemoSection>

      <DemoSection code={radiosCode} title="单选按钮">
        <FormCheck>
          <FormCheckInput id="radioDefault1" name="radioDefault" type="radio" />
          <FormCheckLabel htmlFor="radioDefault1">默认单选按钮</FormCheckLabel>
        </FormCheck>
        <FormCheck>
          <FormCheckInput defaultChecked id="radioDefault2" name="radioDefault" type="radio" />
          <FormCheckLabel htmlFor="radioDefault2">默认选中的单选按钮</FormCheckLabel>
        </FormCheck>
        <p className="mb-0 mt-3 text-muted small">相同 name 的单选按钮互斥，同一时刻只能选中一个</p>
      </DemoSection>

      <DemoSection code={disabledRadiosCode} title="禁用单选按钮">
        <FormCheck>
          <FormCheckInput disabled id="radioDisabled" name="radioDisabled" type="radio" />
          <FormCheckLabel htmlFor="radioDisabled">禁用的单选按钮</FormCheckLabel>
        </FormCheck>
        <FormCheck>
          <FormCheckInput
            defaultChecked
            disabled
            id="radioCheckedDisabled"
            name="radioDisabled"
            type="radio"
          />
          <FormCheckLabel htmlFor="radioCheckedDisabled">禁用且选中的单选按钮</FormCheckLabel>
        </FormCheck>
      </DemoSection>

      <DemoSection code={switchesCode} title="开关">
        {/* oxlint-disable jsx-a11y/role-has-required-aria-props */}
        <FormCheck type="switch">
          <FormCheckInput id="switchCheckDefault" role="switch" />
          <FormCheckLabel htmlFor="switchCheckDefault">默认开关</FormCheckLabel>
        </FormCheck>
        <FormCheck type="switch">
          <FormCheckInput defaultChecked id="switchCheckChecked" role="switch" />
          <FormCheckLabel htmlFor="switchCheckChecked">已选中的开关</FormCheckLabel>
        </FormCheck>
        <FormCheck type="switch">
          <FormCheckInput disabled id="switchCheckDisabled" role="switch" />
          <FormCheckLabel htmlFor="switchCheckDisabled">禁用的开关</FormCheckLabel>
        </FormCheck>
        <FormCheck type="switch">
          <FormCheckInput defaultChecked disabled id="switchCheckCheckedDisabled" role="switch" />
          <FormCheckLabel htmlFor="switchCheckCheckedDisabled">禁用且选中的开关</FormCheckLabel>
        </FormCheck>
        {/* oxlint-enable jsx-a11y/role-has-required-aria-props */}
        <p className="mb-0 mt-3 text-muted small">
          将 FormCheck 的 type 设置为 switch 即可渲染开关样式，建议为输入框添加
          role=&quot;switch&quot; 以向辅助技术更准确地传达控件性质
        </p>
      </DemoSection>

      <DemoSection code={inlineCode} title="行内布局">
        <div>
          <FormCheck inline>
            <FormCheckInput defaultChecked id="inlineCheckbox1" />
            <FormCheckLabel htmlFor="inlineCheckbox1">1</FormCheckLabel>
          </FormCheck>
          <FormCheck inline>
            <FormCheckInput defaultChecked id="inlineCheckbox2" />
            <FormCheckLabel htmlFor="inlineCheckbox2">2</FormCheckLabel>
          </FormCheck>
          <FormCheck inline>
            <FormCheckInput disabled id="inlineCheckbox3" />
            <FormCheckLabel htmlFor="inlineCheckbox3">3（禁用）</FormCheckLabel>
          </FormCheck>
        </div>
        <div className="mt-3">
          <FormCheck inline>
            <FormCheckInput
              defaultChecked
              id="inlineRadio1"
              name="inlineRadioOptions"
              type="radio"
            />
            <FormCheckLabel htmlFor="inlineRadio1">1</FormCheckLabel>
          </FormCheck>
          <FormCheck inline>
            <FormCheckInput id="inlineRadio2" name="inlineRadioOptions" type="radio" />
            <FormCheckLabel htmlFor="inlineRadio2">2</FormCheckLabel>
          </FormCheck>
          <FormCheck inline>
            <FormCheckInput disabled id="inlineRadio3" name="inlineRadioOptions" type="radio" />
            <FormCheckLabel htmlFor="inlineRadio3">3（禁用）</FormCheckLabel>
          </FormCheck>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 inline 属性应用 form-check-inline 类，让复选或单选控件在同一行水平排列
        </p>
      </DemoSection>

      <DemoSection code={reverseCode} title="反向布局">
        <FormCheck reverse>
          <FormCheckInput id="reverseCheck1" />
          <FormCheckLabel htmlFor="reverseCheck1">反向复选框</FormCheckLabel>
        </FormCheck>
        <FormCheck reverse>
          <FormCheckInput disabled id="reverseCheck2" />
          <FormCheckLabel htmlFor="reverseCheck2">禁用的反向复选框</FormCheckLabel>
        </FormCheck>
        {/* oxlint-disable jsx-a11y/role-has-required-aria-props */}
        <FormCheck reverse type="switch">
          <FormCheckInput id="switchCheckReverse" role="switch" />
          <FormCheckLabel htmlFor="switchCheckReverse">反向开关</FormCheckLabel>
        </FormCheck>
        {/* oxlint-enable jsx-a11y/role-has-required-aria-props */}
        <p className="mb-0 mt-3 text-muted small">
          通过 reverse 属性应用 form-check-reverse 类，将输入框放到标签的另一侧
        </p>
      </DemoSection>

      <DemoSection code={withoutLabelsCode} title="无标签">
        <div className="d-flex flex-column gap-3">
          <FormCheckInput aria-label="无标签的复选框" id="checkboxNoLabel" />
          <FormCheckInput
            aria-label="无标签的单选按钮"
            id="radioNoLabel"
            name="radioNoLabel"
            type="radio"
          />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          没有标签文本时可省略 FormCheck 容器，但仍需通过 aria-label 等方式提供可访问名称
        </p>
      </DemoSection>

      <DemoSection code={validationCode} title="校验状态">
        <FormCheck>
          <FormCheckInput id="validCheck" isValid />
          <FormCheckLabel htmlFor="validCheck">有效的复选框</FormCheckLabel>
          <div className="valid-feedback">看起来不错！</div>
        </FormCheck>
        <FormCheck>
          <FormCheckInput id="invalidCheck" isInvalid />
          <FormCheckLabel htmlFor="invalidCheck">无效的复选框</FormCheckLabel>
          <div className="invalid-feedback">必须勾选此复选框。</div>
        </FormCheck>
        <p className="mb-0 mt-3 text-muted small">
          通过 isValid / isInvalid 属性应用 is-valid / is-invalid 校验样式，配合校验反馈文本使用
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex flex-column gap-3">
          <FormCheck>
            <FormCheckInput
              checked={checked}
              id="interactiveCheck"
              onChange={handleCheckedChange}
            />
            <FormCheckLabel htmlFor="interactiveCheck">
              复选框（{checked ? '已选中' : '未选中'}）
            </FormCheckLabel>
          </FormCheck>

          {/* oxlint-disable jsx-a11y/role-has-required-aria-props */}
          <FormCheck type="switch">
            <FormCheckInput
              checked={switched}
              id="interactiveSwitch"
              onChange={handleSwitchedChange}
              role="switch"
            />
            <FormCheckLabel htmlFor="interactiveSwitch">
              开关（{switched ? '开' : '关'}）
            </FormCheckLabel>
          </FormCheck>
          {/* oxlint-enable jsx-a11y/role-has-required-aria-props */}

          <FormCheck>
            <FormCheckInput
              checked={radioValue === 'option1'}
              id="interactiveRadio1"
              name="interactiveRadio"
              onChange={handleRadioValueChange}
              type="radio"
              value="option1"
            />
            <FormCheckLabel htmlFor="interactiveRadio1">选项 1</FormCheckLabel>
          </FormCheck>

          <FormCheck>
            <FormCheckInput
              checked={radioValue === 'option2'}
              id="interactiveRadio2"
              name="interactiveRadio"
              onChange={handleRadioValueChange}
              type="radio"
              value="option2"
            />
            <FormCheckLabel htmlFor="interactiveRadio2">选项 2</FormCheckLabel>
          </FormCheck>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的复选与单选组件，为原生 checkbox、radio 输入框提供统一的自定义外观，包含 FormCheck 容器、FormCheckInput 输入框与 FormCheckLabel 标签，支持不确定状态、禁用、开关、行内/反向布局及有效/无效校验状态"
      componentName="FormCheck"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={formCheckProps}
      typeDefinitions={formCheckTypeDefinitions}
    />
  );
};

export default FormCheckDoc;
