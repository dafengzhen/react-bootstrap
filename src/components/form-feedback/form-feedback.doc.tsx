import clsx from 'clsx';
import { type ChangeEvent, type FormEvent, useState } from 'react';

import { Alert } from '../alert';
import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FormCheck, FormCheckInput, FormCheckLabel } from '../form-check';
import { FormControl } from '../form-control';
import { FormRange } from '../form-range';
import { FormSelect } from '../form-select';
import browserDefaultsCode from './demos/browser-defaults.md?raw';
import customStylesCode from './demos/custom-styles.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import serverSideCode from './demos/server-side.md?raw';
import supportedElementsCode from './demos/supported-elements.md?raw';
import tooltipsCode from './demos/tooltips.md?raw';
import { FormFeedback } from './form-feedback';
import formFeedbackPropsTypeCode from './types/form-feedback-props.md?raw';
import formFeedbackTypeTypeCode from './types/form-feedback-type.md?raw';

const formFeedbackProps: ApiProp[] = [
  {
    defaultValue: "'div'",
    description: '渲染的根元素类型，可传入 `span`、`p` 或自定义组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '反馈内容，通常为一段简短的有效或无效提示文本',
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
    description: '原生 `id` 属性，用于与表单控件的 `aria-describedby` 关联',
    name: 'id',
    type: 'string',
  },
  {
    defaultValue: 'false',
    description:
      '是否以工具提示样式渲染（`valid-tooltip` / `invalid-tooltip`），需要为父容器设置 `position-relative` 以正确定位',
    name: 'tooltip',
    type: 'boolean',
  },
  {
    defaultValue: "'valid'",
    description:
      '反馈类型，`valid` 渲染 `valid-feedback`（或 `valid-tooltip`），`invalid` 渲染 `invalid-feedback`（或 `invalid-tooltip`）',
    name: 'type',
    type: 'FormFeedbackType',
  },
  {
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `role`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
];

const formFeedbackTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: formFeedbackPropsTypeCode,
    description: '表单校验反馈组件属性接口',
    name: 'FormFeedbackProps',
  },
  {
    code: formFeedbackTypeTypeCode,
    description: '表单校验反馈类型',
    name: 'FormFeedbackType',
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FormFeedbackDoc = () => {
  const [agreed, setAgreed] = useState(false);
  const [browserSuccess, setBrowserSuccess] = useState(false);
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [wasValidated, setWasValidated] = useState(false);

  const isValidEmail = EMAIL_PATTERN.test(email);
  const isValidPassword = password.length >= 8;
  const isValid = isValidEmail && isValidPassword && city !== '' && agreed;

  const handleBrowserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = event.currentTarget.checkValidity();
    setWasValidated(!valid);
    setBrowserSuccess(valid);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCity(event.target.value);
  };

  const handleAgreedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.target.checked);
  };

  const handleInteractiveSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const demoContent = (
    <>
      <DemoSection code={customStylesCode} title="自定义样式">
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
          为表单控件设置 isValid / isInvalid 属性应用 is-valid / is-invalid 样式，并通过
          FormFeedback 提供对应的有效/无效反馈文本
        </p>
      </DemoSection>

      <DemoSection code={browserDefaultsCode} title="浏览器默认校验">
        <form
          className={clsx('row g-3', wasValidated && 'was-validated')}
          noValidate
          onSubmit={handleBrowserSubmit}
        >
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationDefault01">
              名字
            </label>
            <FormControl defaultValue="Mark" id="validationDefault01" required type="text" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationDefault02">
              姓氏
            </label>
            <FormControl defaultValue="Otto" id="validationDefault02" required type="text" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationDefault03">
              城市
            </label>
            <FormControl id="validationDefault03" required type="text" />
            <FormFeedback type="invalid">请填写城市。</FormFeedback>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationDefault04">
              邮编
            </label>
            <FormControl id="validationDefault04" pattern="[0-9]{6}" required type="text" />
            <FormFeedback type="invalid">请输入 6 位数字邮编。</FormFeedback>
          </div>
          <div className="col-12">
            <Button type="submit" variant="primary">
              提交表单
            </Button>
          </div>
          {browserSuccess ? <Alert variant="success">浏览器默认校验通过！</Alert> : null}
        </form>
        <p className="mb-0 mt-3 text-muted small">
          借助原生约束校验（required、pattern），提交时通过 checkValidity 决定是否添加 was-validated
          类，让浏览器自动应用 :valid / :invalid 样式并显示对应反馈
        </p>
      </DemoSection>

      <DemoSection code={serverSideCode} title="服务端校验">
        <form className="row g-3 was-validated" noValidate>
          <div className="col-md-4">
            <label className="form-label" htmlFor="validationServer01">
              名字
            </label>
            <FormControl defaultValue="Mark" id="validationServer01" isValid required type="text" />
            <FormFeedback type="valid">看起来不错！</FormFeedback>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="validationServer02">
              姓氏
            </label>
            <FormControl defaultValue="Otto" id="validationServer02" isValid required type="text" />
            <FormFeedback type="valid">看起来不错！</FormFeedback>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="validationServerUsername">
              用户名
            </label>
            <FormControl
              aria-describedby="usernameFeedback"
              id="validationServerUsername"
              isInvalid
              required
              type="text"
            />
            <FormFeedback id="usernameFeedback" type="invalid">
              请填写用户名。
            </FormFeedback>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationServer03">
              城市
            </label>
            <FormControl id="validationServer03" isInvalid required type="text" />
            <FormFeedback type="invalid">请填写有效的城市。</FormFeedback>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationServer04">
              区/州
            </label>
            <FormSelect
              aria-label="选择区/州"
              defaultValue=""
              id="validationServer04"
              isInvalid
              required
            >
              <option disabled value="">
                请选择...
              </option>
              <option value="1">选项 1</option>
            </FormSelect>
            <FormFeedback type="invalid">请选择一个有效的区/州。</FormFeedback>
          </div>
          <div className="col-12">
            <Button type="submit" variant="primary">
              提交表单
            </Button>
          </div>
        </form>
        <p className="mb-0 mt-3 text-muted small">
          服务端渲染场景下，为表单添加 was-validated 类并显式设置 is-valid / is-invalid
          状态，即可在页面加载后立即展示校验结果
        </p>
      </DemoSection>

      <DemoSection code={supportedElementsCode} title="支持的元素">
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
            <FormRange aria-label="无效的范围示例" defaultValue={10} isInvalid />
            <FormFeedback type="invalid">请选择一个值。</FormFeedback>
          </div>
          <FormCheck>
            <FormCheckInput id="supportedCheck" isInvalid />
            <FormCheckLabel htmlFor="supportedCheck">无效的复选框</FormCheckLabel>
            <FormFeedback type="invalid">必须勾选此复选框。</FormFeedback>
          </FormCheck>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          校验样式同样适用于 FormSelect、FormRange 与 FormCheck 等表单控件
        </p>
      </DemoSection>

      <DemoSection code={tooltipsCode} title="工具提示">
        <div className="d-flex flex-column gap-3">
          <div className="position-relative">
            <FormControl aria-label="工具提示有效输入示例" isValid required type="text" />
            <FormFeedback tooltip type="valid">
              看起来不错！
            </FormFeedback>
          </div>
          <div className="position-relative">
            <FormControl aria-label="工具提示无效输入示例" isInvalid required type="text" />
            <FormFeedback tooltip type="invalid">
              请输入内容。
            </FormFeedback>
          </div>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          设置 tooltip 属性可渲染 valid-tooltip / invalid-tooltip 工具提示样式，父容器需要
          position-relative 定位
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <form className="row g-3" noValidate onSubmit={handleInteractiveSubmit}>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationCustomEmail">
              邮箱
            </label>
            <FormControl
              id="validationCustomEmail"
              isInvalid={submitted && !isValidEmail}
              isValid={submitted && isValidEmail}
              onChange={handleEmailChange}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
            <FormFeedback type="valid">邮箱格式正确！</FormFeedback>
            <FormFeedback type="invalid">请输入有效的邮箱地址。</FormFeedback>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationCustomPassword">
              密码
            </label>
            <FormControl
              id="validationCustomPassword"
              isInvalid={submitted && !isValidPassword}
              isValid={submitted && isValidPassword}
              onChange={handlePasswordChange}
              placeholder="至少 8 位字符"
              required
              type="password"
              value={password}
            />
            <FormFeedback type="valid">密码符合要求！</FormFeedback>
            <FormFeedback type="invalid">密码长度至少为 8 位。</FormFeedback>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="validationCustomCity">
              城市
            </label>
            <FormSelect
              id="validationCustomCity"
              isInvalid={submitted && city === ''}
              isValid={submitted && city !== ''}
              onChange={handleCityChange}
              required
              value={city}
            >
              <option value="">请选择...</option>
              <option value="beijing">北京</option>
              <option value="shanghai">上海</option>
              <option value="guangzhou">广州</option>
              <option value="shenzhen">深圳</option>
            </FormSelect>
            <FormFeedback type="invalid">请选择一个城市。</FormFeedback>
          </div>
          <div className="col-12">
            <FormCheck>
              <FormCheckInput
                checked={agreed}
                id="validationCustomAgree"
                isInvalid={submitted && !agreed}
                onChange={handleAgreedChange}
                required
              />
              <FormCheckLabel htmlFor="validationCustomAgree">同意条款与条件</FormCheckLabel>
              <FormFeedback type="invalid">请先同意条款与条件。</FormFeedback>
            </FormCheck>
          </div>
          <div className="col-12">
            <Button type="submit" variant="primary">
              提交表单
            </Button>
          </div>
          {submitted && isValid ? <Alert variant="success">表单校验通过！</Alert> : null}
        </form>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的表单校验反馈组件，为表单控件提供有效（valid-feedback / valid-tooltip）与无效（invalid-feedback / invalid-tooltip）反馈文本，配合 isValid / isInvalid 校验状态、was-validated 表单类与浏览器原生约束校验使用"
      componentName="FormFeedback"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={formFeedbackProps}
      typeDefinitions={formFeedbackTypeDefinitions}
    />
  );
};

export default FormFeedbackDoc;
