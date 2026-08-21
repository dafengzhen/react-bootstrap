import { type ChangeEvent, useState } from 'react';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { FormText } from '../form-control';
import basicCode from './demos/basic.md?raw';
import disabledCode from './demos/disabled.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import minMaxCode from './demos/min-max.md?raw';
import stepsCode from './demos/steps.md?raw';
import validationCode from './demos/validation.md?raw';
import { FormRange } from './form-range';
import formRangePropsTypeCode from './types/form-range-props.md?raw';

const formRangeProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '50',
    description:
      '原生 `defaultValue` 属性，非受控的默认值；未设置时浏览器取 `min` 与 `max` 的中间值',
    name: 'defaultValue',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '是否禁用滑动条，禁用的控件不可聚焦且不参与表单提交',
    name: 'disabled',
    type: 'boolean',
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
    defaultValue: '100',
    description: '允许的最大值，不能小于 `min`',
    name: 'max',
    type: 'number',
  },
  {
    defaultValue: '0',
    description: '允许的最小值，不能大于 `max`',
    name: 'min',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '原生 `name` 属性，控件值随表单一起提交',
    name: 'name',
    type: 'string',
  },
  {
    defaultValue: '1',
    description: '步进间隔，控制每次移动滑块的增量；设为 `any` 时允许任意小数增量',
    name: 'step',
    type: "number | 'any'",
  },
  {
    defaultValue: '-',
    description: '受控的当前值',
    name: 'value',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `onChange`、`onInput`、`aria-*` 等）',
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
  },
];

const formRangeTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: formRangePropsTypeCode,
    description: '范围滑动条组件属性接口',
    name: 'FormRangeProps',
  },
];

export const FormRangeDoc = () => {
  const [volume, setVolume] = useState(50);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <FormRange aria-label="默认范围示例" />
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <FormRange aria-label="禁用的范围示例" disabled />
        <p className="mb-0 mt-3 text-muted small">禁用的滑动条呈灰色外观且不可交互</p>
      </DemoSection>

      <DemoSection code={minMaxCode} title="最小值与最大值">
        <FormRange aria-label="最小值与最大值示例" max={5} min={0} />
        <p className="mb-0 mt-3 text-muted small">
          通过 min / max 属性限制取值范围，默认范围为 0 到 100
        </p>
      </DemoSection>

      <DemoSection code={stepsCode} title="步进">
        <div className="d-flex flex-column gap-3">
          <FormRange aria-label="默认步进示例" />
          <FormRange aria-label="半步进示例" max={5} min={0} step={0.5} />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          默认情况下滑动条按整数值「吸附」移动，通过 step 属性调整步进间隔，如 0.5 或 any（任意值）
        </p>
      </DemoSection>

      <DemoSection code={validationCode} title="校验状态">
        <div className="d-flex flex-column gap-3">
          <div>
            <FormRange aria-label="有效的范围示例" defaultValue={75} isValid />
            <div className="valid-feedback">看起来不错！</div>
          </div>
          <div>
            <FormRange aria-label="无效的范围示例" defaultValue={10} isInvalid />
            <div className="invalid-feedback">请选择一个值。</div>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 isValid / isInvalid 属性应用 is-valid / is-invalid 校验样式，配合校验反馈文本使用
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div>
          <FormRange aria-label="音量调节示例" onChange={handleChange} value={volume} />
          <FormText muted>当前值：{volume}</FormText>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的范围滑动条组件，为原生 range 输入框提供统一外观，支持最小/最大值、步进间隔、禁用状态及有效/无效校验状态"
      componentName="FormRange"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={formRangeProps}
      typeDefinitions={formRangeTypeDefinitions}
    />
  );
};

export default FormRangeDoc;
