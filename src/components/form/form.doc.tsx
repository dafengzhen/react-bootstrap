import { type ChangeEvent, type FormEvent, useState } from 'react';

import { Alert } from '../alert';
import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { FloatingLabel } from '../floating-label';
import { FormCheck, FormCheckInput, FormCheckLabel } from '../form-check';
import { FormControl, FormText } from '../form-control';
import { FormFeedback } from '../form-feedback';
import { FormSelect } from '../form-select';
import { Col, FormLabel, Row } from '../layout';
import basicCode from './demos/basic.md?raw';
import controlIdCode from './demos/control-id.md?raw';
import disabledCode from './demos/disabled.md?raw';
import floatingCode from './demos/floating.md?raw';
import gridCode from './demos/grid.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import validatedCode from './demos/validated.md?raw';
import { Form } from './form';
import { FormGroup } from './form-group';
import formContextValueTypeCode from './types/form-context-value.md?raw';
import formGroupPropsTypeCode from './types/form-group-props.md?raw';
import formPropsTypeCode from './types/form-props.md?raw';

const formProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: 'false',
    description:
      '是否应用 `was-validated` 类以启用浏览器原生约束校验的视觉反馈，通常配合 `required`、`minLength` 等原生校验属性与 `noValidate` 使用',
    name: 'validated',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '表单元素的所有原生属性（如 `onSubmit`、`action`、`method`、`noValidate` 等）',
    name: '...rest',
    type: 'FormHTMLAttributes<HTMLFormElement>',
  },
  {
    component: 'FormGroup',
    defaultValue: "'div'",
    description: '渲染的根元素类型，可传入 `Row` 等以复用栅格布局',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'FormGroup',
    defaultValue: '-',
    description: '分组内的控件与标签内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'FormGroup',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'FormGroup',
    defaultValue: '-',
    description:
      '分组内控件的关联 id，通过 Context 自动作为 `FormLabel` / `FormCheckLabel` 的 `htmlFor` 与 `FormControl` / `FormCheckInput` 的 `id`，子控件显式设置的 id / htmlFor 优先',
    name: 'controlId',
    type: 'string',
  },
  {
    component: 'FormGroup',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
  },
];

const formTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: formContextValueTypeCode,
    description: '表单分组上下文值类型',
    name: 'FormContextValue',
  },
  {
    code: formGroupPropsTypeCode,
    description: '表单分组组件属性接口',
    name: 'FormGroupProps',
  },
  {
    code: formPropsTypeCode,
    description: '表单组件属性接口',
    name: 'FormProps',
  },
];

export const FormDoc = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Form>
          <FormGroup className="mb-3" controlId="formBasicEmail">
            <FormLabel>邮箱地址</FormLabel>
            <FormControl placeholder="name@example.com" type="email" />
            <FormText muted>我们不会将您的邮箱分享给任何人。</FormText>
          </FormGroup>

          <FormGroup className="mb-3" controlId="formBasicPassword">
            <FormLabel>密码</FormLabel>
            <FormControl placeholder="请输入密码" type="password" />
          </FormGroup>

          <FormGroup className="mb-3" controlId="formBasicCheckbox">
            <FormCheck>
              <FormCheckInput type="checkbox" />
              <FormCheckLabel>记住我</FormCheckLabel>
            </FormCheck>
          </FormGroup>

          <Button type="submit" variant="primary">
            提交
          </Button>
        </Form>
      </DemoSection>

      <DemoSection code={controlIdCode} title="自动关联">
        <Form>
          <FormGroup className="mb-3" controlId="autoEmail">
            <FormLabel>邮箱</FormLabel>
            <FormControl placeholder="name@example.com" type="email" />
            <FormText muted>点击标签即可聚焦输入框，无需手动设置 id 与 htmlFor。</FormText>
          </FormGroup>

          <FormGroup controlId="autoAgreement">
            <FormCheck>
              <FormCheckInput type="checkbox" />
              <FormCheckLabel>同意服务条款</FormCheckLabel>
            </FormCheck>
          </FormGroup>
        </Form>
        <p className="mb-0 mt-3 text-muted small">
          FormGroup 的 controlId 会通过 Context 自动作为 FormLabel / FormCheckLabel 的 htmlFor 与
          FormControl / FormCheckInput 的 id，显式设置的 id / htmlFor 优先
        </p>
      </DemoSection>

      <DemoSection code={validatedCode} title="表单校验">
        <Form noValidate onSubmit={handleSubmit} validated>
          <FormGroup className="mb-3" controlId="validationEmail">
            <FormLabel>邮箱</FormLabel>
            <FormControl placeholder="name@example.com" required type="email" />
            <FormFeedback>请输入有效的邮箱地址。</FormFeedback>
          </FormGroup>

          <FormGroup className="mb-3" controlId="validationPassword">
            <FormLabel>密码</FormLabel>
            <FormControl minLength={8} placeholder="至少 8 个字符" required type="password" />
            <FormFeedback>密码至少需要 8 个字符。</FormFeedback>
          </FormGroup>

          <FormGroup className="mb-3" controlId="validationAgreement">
            <FormCheck>
              <FormCheckInput required type="checkbox" />
              <FormCheckLabel>我已阅读并同意条款</FormCheckLabel>
              <FormFeedback>请先勾选同意条款。</FormFeedback>
            </FormCheck>
          </FormGroup>

          <Button type="submit" variant="primary">
            注册
          </Button>
        </Form>
        <p className="mb-0 mt-3 text-muted small">
          validated 属性为表单添加 was-validated 类，提交或输入后按原生约束校验显示有效/无效样式与
          FormFeedback 反馈
        </p>
      </DemoSection>

      <DemoSection code={gridCode} title="栅格布局">
        <Form>
          <FormGroup as={Row} className="mb-3" controlId="gridEmail">
            <FormLabel column sm={2}>
              邮箱
            </FormLabel>
            <Col sm={10}>
              <FormControl placeholder="name@example.com" type="email" />
            </Col>
          </FormGroup>

          <FormGroup as={Row} className="mb-3" controlId="gridPassword">
            <FormLabel column sm={2}>
              密码
            </FormLabel>
            <Col sm={10}>
              <FormControl placeholder="请输入密码" type="password" />
            </Col>
          </FormGroup>

          <FormGroup as={Row} className="mb-3" controlId="gridCheckbox">
            <Col sm={{ offset: 2, span: 10 }}>
              <FormCheck>
                <FormCheckInput type="checkbox" />
                <FormCheckLabel>记住我</FormCheckLabel>
              </FormCheck>
            </Col>
          </FormGroup>

          <Button type="submit" variant="primary">
            登录
          </Button>
        </Form>
        <p className="mb-0 mt-3 text-muted small">
          将 FormGroup 的 as 设为 Row，配合 FormLabel 的 column 属性与 Col 即可构建水平布局表单
        </p>
      </DemoSection>

      <DemoSection code={floatingCode} title="浮动标签">
        <Form>
          <FloatingLabel className="mb-3" controlId="floatingEmail" label="邮箱地址">
            <FormControl placeholder="name@example.com" type="email" />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="密码">
            <FormControl placeholder="请输入密码" type="password" />
          </FloatingLabel>
        </Form>
      </DemoSection>

      <DemoSection code={disabledCode} title="整体禁用">
        <Form>
          <fieldset disabled>
            <FormGroup className="mb-3" controlId="disabledTextInput">
              <FormLabel>禁用输入</FormLabel>
              <FormControl placeholder="禁用的输入框" type="text" />
            </FormGroup>

            <FormGroup className="mb-3" controlId="disabledSelect">
              <FormLabel>禁用选择</FormLabel>
              <FormSelect aria-label="禁用的下拉选择">
                <option>禁用的选项</option>
              </FormSelect>
            </FormGroup>

            <FormGroup controlId="disabledCheck">
              <FormCheck>
                <FormCheckInput type="checkbox" />
                <FormCheckLabel>无法勾选</FormCheckLabel>
              </FormCheck>
            </FormGroup>

            <Button className="mt-3" type="submit" variant="primary">
              提交
            </Button>
          </fieldset>
        </Form>
        <p className="mb-0 mt-3 text-muted small">
          使用原生 fieldset 的 disabled 属性可一次性禁用组内所有控件
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3" controlId="loginEmail">
            <FormLabel>邮箱</FormLabel>
            <FormControl
              onChange={handleEmailChange}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </FormGroup>

          <FormGroup className="mb-3" controlId="loginPassword">
            <FormLabel>密码</FormLabel>
            <FormControl
              onChange={handlePasswordChange}
              placeholder="请输入密码"
              required
              type="password"
              value={password}
            />
          </FormGroup>

          <Button type="submit" variant="primary">
            登录
          </Button>

          {submitted && (
            <Alert className="mt-3" variant="success">
              登录成功，邮箱：{email}
            </Alert>
          )}
        </Form>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的表单组合组件，提供 Form 表单容器与 FormGroup 分组，配合 FormLabel、FormControl、FormCheck、FormSelect、FormFeedback、FloatingLabel 等组件快速搭建表单，支持 validated 原生约束校验、controlId 自动关联标签与控件、栅格化水平布局、浮动标签与整体禁用"
      componentName="Form"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={formProps}
      typeDefinitions={formTypeDefinitions}
    />
  );
};

export default FormDoc;
