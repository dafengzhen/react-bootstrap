import { type FormEvent, Fragment, useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormText } from '../form-control';
import basicCode from './demos/basic.md?raw';
import completeCode from './demos/complete.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customCode from './demos/custom.md?raw';
import formCode from './demos/form.md?raw';
import lengthCode from './demos/length-separator.md?raw';
import passwordCode from './demos/password.md?raw';
import pasteCode from './demos/paste.md?raw';
import patternCode from './demos/pattern.md?raw';
import sizesCode from './demos/sizes.md?raw';
import statesCode from './demos/states.md?raw';
import { InputOtp } from './input-otp';
import { useInputOtp } from './input-otp-context';
import { InputOtpSlot } from './input-otp-slot';
import inputOtpContextValueTypeCode from './types/input-otp-context-value.md?raw';
import inputOtpPropsTypeCode from './types/input-otp-props.md?raw';
import inputOtpSizeTypeCode from './types/input-otp-size.md?raw';
import inputOtpSlotPropsTypeCode from './types/input-otp-slot-props.md?raw';

const inputOtpProps: ApiProp[] = [
  {
    component: 'InputOtp',
    defaultValue: "'div'",
    description: '渲染的根容器元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'InputOtp',
    defaultValue: "'one-time-code'",
    description: '仅应用于第一个槽位的自动填充提示，其余槽位为 `off`，便于短信验证码自动填充',
    name: 'autoComplete',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '挂载后是否自动聚焦第一个槽位',
    name: 'autoFocus',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description:
      '自定义槽位组合内容，传入后替换内置槽位渲染（`name` 隐藏域仍会保留），配合 `useInputOtp` 与 `InputOtpSlot` 使用',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '自定义类名，作用于根容器',
    name: 'className',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: "''",
    description: '非受控模式下的初始验证码值',
    name: 'defaultValue',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '是否禁用所有槽位（隐藏域同步禁用）',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: "'text'",
    description: '槽位的虚拟键盘类型，如 `numeric`、`tel` 等',
    name: 'inputMode',
    type: "InputHTMLAttributes<HTMLInputElement>['inputMode']",
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '是否为所有槽位应用无效状态样式（`is-invalid`）',
    name: 'isInvalid',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '是否为所有槽位应用有效状态样式（`is-valid`）',
    name: 'isValid',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: '6',
    description: '槽位数量，对应验证码的字符个数',
    name: 'length',
    type: 'number',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '隐藏域的 `name`，传入后完整验证码随表单提交',
    name: 'name',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '验证码值变化时的回调，携带最新的完整值',
    name: 'onChange',
    type: '(value: string) => void',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '验证码从未填满变为填满时触发的回调，携带完整值',
    name: 'onComplete',
    type: '(value: string) => void',
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '是否以密码掩码显示槽位内容',
    name: 'password',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description:
      '单字符校验正则表达式源码（如 `[0-9]`、`[a-zA-Z0-9]`），不匹配的输入与粘贴字符会被过滤',
    name: 'pattern',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: "''",
    description: '每个槽位的占位符，通常为单个字符',
    name: 'placeholder',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '是否只读，槽位可聚焦但不可编辑',
    name: 'readOnly',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: 'false',
    description: '隐藏域的 `required`，空值提交时触发浏览器校验（需配合 `name`）',
    name: 'required',
    type: 'boolean',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '渲染在相邻槽位之间的分隔内容，如分隔符、图标等',
    name: 'separator',
    type: 'ReactNode',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '槽位尺寸，可选 `sm`、`lg`，对应 `form-control-sm`、`form-control-lg`',
    name: 'size',
    type: 'InputOtpSize',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '受控的验证码值，配合 `onChange` 使用；传入后组件不再维护内部状态',
    name: 'value',
    type: 'string',
  },
  {
    component: 'InputOtp',
    defaultValue: '-',
    description: '根容器的所有原生属性（如 `style`、`aria-*`、`data-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'InputOtpSlot',
    defaultValue: '-',
    description: '自定义类名，可用于槽位的个性化样式',
    name: 'className',
    type: 'string',
  },
  {
    component: 'InputOtpSlot',
    defaultValue: '-',
    description: '槽位索引（必填），决定该输入格承载验证码的哪一位；独立使用时渲染为普通表单控件',
    name: 'index',
    type: 'number',
  },
  {
    component: 'InputOtpSlot',
    defaultValue: '-',
    description:
      '输入框的其余原生属性（`size`、`type` 除外）；由组件内部维护的 `value`、`onChange`、`onKeyDown`、`onPaste` 等会被覆盖',
    name: '...rest',
    type: 'InputHTMLAttributes',
  },
];

const inputOtpTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: inputOtpContextValueTypeCode,
    description: '验证码输入上下文值，可通过 `useInputOtp` 获取（不在 `InputOtp` 内返回 `null`）',
    name: 'InputOtpContextValue',
  },
  {
    code: inputOtpPropsTypeCode,
    description: '验证码输入组件属性接口',
    name: 'InputOtpProps',
  },
  {
    code: inputOtpSizeTypeCode,
    description: '槽位尺寸类型，对应 `form-control-sm`、`form-control-lg`',
    name: 'InputOtpSize',
  },
  {
    code: inputOtpSlotPropsTypeCode,
    description: '单个槽位组件属性接口',
    name: 'InputOtpSlotProps',
  },
];

const CustomOtpSlots = () => {
  const otp = useInputOtp();

  return (
    <div className="d-flex align-items-center gap-2">
      {otp?.slots.map((char, index) => (
        <Fragment key={index}>
          {index === 3 && <span className="text-muted">—</span>}
          <InputOtpSlot
            className={char === '' ? 'bg-secondary-subtle' : 'bg-primary-subtle'}
            index={index}
          />
        </Fragment>
      ))}
    </div>
  );
};

export const InputOtpDoc = () => {
  const [code, setCode] = useState('');
  const [completed, setCompleted] = useState('');
  const [submitted, setSubmitted] = useState('');

  const handleClear = () => {
    setCode('');
  };

  const handleFill = () => {
    setCode('246813');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get('code') ?? ''));
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <InputOtp />
        <p className="mb-0 mt-3 text-muted small">
          默认渲染 6
          个单字符输入格，输入后自动跳至下一格；空格退格会回退并清除上一格，支持左右方向键与
          Home/End 快速定位
        </p>
      </DemoSection>

      <DemoSection code={lengthCode} title="位数与分隔符">
        <InputOtp length={4} separator={<span className="align-self-center text-muted">-</span>} />
        <p className="mb-0 mt-3 text-muted small">
          length 控制槽位数量；separator 渲染在相邻槽位之间，可用于形如「xxxx-xxxx」的掩码格式
        </p>
      </DemoSection>

      <DemoSection code={patternCode} title="数字模式与校验">
        <InputOtp inputMode="numeric" pattern="[0-9]" />
        <p className="mb-0 mt-3 text-muted small">
          inputMode 在移动端唤起数字键盘；pattern 为单字符正则，不匹配的输入与粘贴字符会被自动过滤
        </p>
      </DemoSection>

      <DemoSection code={passwordCode} title="掩码输入">
        <InputOtp defaultValue="246813" password />
        <p className="mb-0 mt-3 text-muted small">password 开启后每个槽位以密码掩码显示输入内容</p>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-column gap-3">
          <InputOtp size="sm" />
          <InputOtp />
          <InputOtp size="lg" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          size 提供 sm、lg 两种尺寸，槽位宽度与字号随 form-control 尺寸类同步缩放
        </p>
      </DemoSection>

      <DemoSection code={statesCode} title="状态">
        <div className="d-flex flex-column gap-3">
          <InputOtp defaultValue="123456" disabled />
          <InputOtp defaultValue="123456" readOnly />
          <InputOtp defaultValue="1234" isInvalid length={6} />
          <InputOtp defaultValue="123456" isValid />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          支持 disabled 禁用、readOnly 只读，以及 isInvalid / isValid
          校验状态样式；单字符槽位会自动隐藏校验图标， 状态通过边框颜色体现
        </p>
      </DemoSection>

      <DemoSection code={pasteCode} title="粘贴填充">
        <InputOtp />
        <p className="mb-0 mt-3 text-muted small">
          复制验证码 246813，粘贴到任意输入格可一次性填充从该格开始的剩余槽位；超出的字符与不匹配
          pattern 的字符会被丢弃
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <InputOtp onChange={setCode} value={code} />
        <div className="d-flex gap-2 mt-3">
          <Button onClick={handleFill} variant="outline-secondary">
            填充
          </Button>
          <Button onClick={handleClear} variant="outline-secondary">
            清空
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          传入 value 后组件不再维护内部状态，值完全由外部控制，onChange 反馈每次编辑后的完整验证码
        </p>
      </DemoSection>

      <DemoSection code={completeCode} title="完成回调">
        <InputOtp onComplete={setCompleted} />
        <FormText muted>
          {completed === '' ? '输入完成后触发 onComplete' : `已完成：${completed}`}
        </FormText>
        <p className="mb-0 mt-3 text-muted small">
          onComplete 在验证码从未填满变为填满时触发，适合自动提交或校验场景
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义插槽">
        <InputOtp length={6}>
          <CustomOtpSlots />
        </InputOtp>
        <p className="mb-0 mt-3 text-muted small">
          children 替换内置槽位后，可通过 useInputOtp 读取 slots 并用 InputOtpSlot
          按索引渲染，实现分组、分隔与个性化样式
        </p>
      </DemoSection>

      <DemoSection code={formCode} title="表单提交">
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <InputOtp name="code" />
          <Button type="submit" variant="primary">
            提交
          </Button>
        </form>
        <FormText muted>
          {submitted === '' ? '提交后在此显示表单值' : `已提交：${submitted}`}
        </FormText>
        <p className="mb-0 mt-3 text-muted small">
          name 将完整验证码写入隐藏域随表单提交，可配合 required 参与浏览器原生校验
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的验证码输入组件，以多个单字符输入格收集一次性验证码，支持输入自动跳格、空格退格回退、方向键与 Home/End 定位、粘贴分发填充，提供数字模式校验、掩码输入、分隔符、校验状态、完成回调、受控模式与隐藏域表单提交，配合 InputOtpSlot / useInputOtp 可自定义槽位组合"
      componentName="InputOtp"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={inputOtpProps}
      typeDefinitions={inputOtpTypeDefinitions}
    />
  );
};

export default InputOtpDoc;
