import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import additionalContentCode from './demos/additional-content.md?raw';
import dismissibleCode from './demos/dismissible.md?raw';
import iconsCode from './demos/icons.md?raw';
import linkColorCode from './demos/link-color.md?raw';
import liveExampleCode from './demos/live-example.md?raw';
import variantsCode from './demos/variants.md?raw';
import { Alert, AlertHeading, AlertLink } from './index';
import alertHeadingPropsTypeCode from './types/alert-heading-props.md?raw';
import alertLinkPropsTypeCode from './types/alert-link-props.md?raw';
import alertPropsTypeCode from './types/alert-props.md?raw';
import alertVariantTypeCode from './types/alert-variant.md?raw';

const alertProps: ApiProp[] = [
  {
    component: 'Alert',
    defaultValue: "'primary'",
    description: '情景颜色变体，渲染为 `alert-*` 类',
    name: 'variant',
    type: 'AlertVariant',
  },
  {
    component: 'Alert',
    defaultValue: 'false',
    description: '可关闭模式，渲染 `alert-dismissible` 类并在内容末尾渲染关闭按钮',
    name: 'dismissible',
    type: 'boolean',
  },
  {
    component: 'Alert',
    defaultValue: '-',
    description:
      '受控的显示状态，为 `false` 时以淡出动画移除警告框；不传时为非受控，点击关闭按钮自动隐藏',
    name: 'show',
    type: 'boolean',
  },
  {
    component: 'Alert',
    defaultValue: '-',
    description: '点击关闭按钮时触发的回调，受控模式下需配合 `show` 一起使用',
    name: 'onClose',
    type: '() => void',
  },
  {
    component: 'Alert',
    defaultValue: "'Close alert'",
    description: '关闭按钮的无障碍标签，向屏幕阅读器描述按钮用途',
    name: 'closeLabel',
    type: 'string',
  },
  {
    component: 'Alert',
    defaultValue: "'white'（variant 为 dark 时）",
    description: '关闭按钮变体，`variant="dark"` 时默认为 `white`，用于深色背景',
    name: 'closeVariant',
    type: 'CloseButtonVariant',
  },
  {
    component: 'AlertHeading',
    defaultValue: "'h4'",
    description: '渲染的标题元素标签，可选其他标题级别或元素',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AlertLink',
    defaultValue: "'a'",
    description: '渲染的元素标签，默认渲染为 `a` 标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AlertLink',
    defaultValue: "'#'",
    description: '链接地址',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '内容',
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
    description: '透传原生元素属性（如 `onClick`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const alertTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: alertVariantTypeCode,
    description: '警告框情景颜色变体类型',
    name: 'AlertVariant',
  },
  {
    code: alertPropsTypeCode,
    description: '警告框组件属性接口',
    name: 'AlertProps',
  },
  {
    code: alertHeadingPropsTypeCode,
    description: '警告框标题组件属性接口',
    name: 'AlertHeadingProps',
  },
  {
    code: alertLinkPropsTypeCode,
    description: '警告框链接组件属性接口',
    name: 'AlertLinkProps',
  },
];

export const AlertDoc = () => {
  const [showDismissible, setShowDismissible] = useState(true);
  const [showLive, setShowLive] = useState(false);

  const handleDismissibleClose = () => {
    setShowDismissible(false);
  };

  const handleLiveClose = () => {
    setShowLive(false);
  };

  const handleLiveShow = () => {
    setShowLive(true);
  };

  const demoContent = (
    <>
      <DemoSection code={variantsCode} title="变体">
        <div className="d-flex flex-column gap-3">
          <Alert variant="primary">主要提示 — 简单的 primary 警告框示例，快来看看吧！</Alert>
          <Alert variant="secondary">次要提示 — 简单的 secondary 警告框示例，快来看看吧！</Alert>
          <Alert variant="success">成功提示 — 简单的 success 警告框示例，快来看看吧！</Alert>
          <Alert variant="danger">危险提示 — 简单的 danger 警告框示例，快来看看吧！</Alert>
          <Alert variant="warning">警告提示 — 简单的 warning 警告框示例，快来看看吧！</Alert>
          <Alert variant="info">信息提示 — 简单的 info 警告框示例，快来看看吧！</Alert>
          <Alert variant="light">浅色提示 — 简单的 light 警告框示例，快来看看吧！</Alert>
          <Alert variant="dark">深色提示 — 简单的 dark 警告框示例，快来看看吧！</Alert>
        </div>
      </DemoSection>

      <DemoSection code={liveExampleCode} title="实时示例">
        <Alert dismissible onClose={handleLiveClose} show={showLive} variant="warning">
          <strong>注意！</strong> 这是一条可以通过关闭按钮隐藏的警告消息。
        </Alert>
        {!showLive && (
          <Button onClick={handleLiveShow} variant="outline-primary">
            重新显示警告框
          </Button>
        )}
      </DemoSection>

      <DemoSection code={dismissibleCode} title="可关闭">
        <Alert dismissible onClose={handleDismissibleClose} show={showDismissible} variant="danger">
          <strong>危险提示！</strong> 点击右侧关闭按钮，警告框会以淡出动画从页面移除。
        </Alert>
        {!showDismissible && (
          <Button onClick={() => setShowDismissible(true)} size="sm" variant="outline-primary">
            重新显示警告框
          </Button>
        )}
      </DemoSection>

      <DemoSection code={linkColorCode} title="链接颜色">
        <div className="d-flex flex-column gap-3">
          <Alert variant="primary">
            主要提示 — 这是一条主要警告消息，<AlertLink href="#">点击查看详情</AlertLink>。
          </Alert>
          <Alert variant="secondary">
            次要提示 — 这是一条次要警告消息，<AlertLink href="#">点击查看详情</AlertLink>。
          </Alert>
        </div>
      </DemoSection>

      <DemoSection code={additionalContentCode} title="附加内容">
        <Alert variant="success">
          <AlertHeading>做得很好！</AlertHeading>
          <p>
            您成功阅读了这条重要的提示消息。这段示例文字会稍微长一些，以便您了解警告框中的间距在不同内容之间是如何变化的。
          </p>
          <hr />
          <p className="mb-0">每当您需要时，请务必使用边距工具来保持内容的整洁。</p>
        </Alert>
      </DemoSection>

      <DemoSection code={iconsCode} title="图标">
        <div className="d-flex flex-column gap-3">
          <Alert className="d-flex align-items-center" variant="primary">
            <svg
              aria-hidden="true"
              className="bi flex-shrink-0 me-2"
              height="16"
              viewBox="0 0 16 16"
              width="16"
            >
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
            </svg>
            <div>主要提示示例，带有图标</div>
          </Alert>
          <Alert className="d-flex align-items-center" variant="success">
            <svg
              aria-hidden="true"
              className="bi flex-shrink-0 me-2"
              height="16"
              viewBox="0 0 16 16"
              width="16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            <div>成功提示示例，带有图标</div>
          </Alert>
          <Alert className="d-flex align-items-center" variant="warning">
            <svg
              aria-hidden="true"
              className="bi flex-shrink-0 me-2"
              height="16"
              viewBox="0 0 16 16"
              width="16"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
            <div>警告提示示例，带有图标</div>
          </Alert>
          <Alert className="d-flex align-items-center" variant="danger">
            <svg
              aria-hidden="true"
              className="bi flex-shrink-0 me-2"
              height="16"
              viewBox="0 0 16 16"
              width="16"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
            </svg>
            <div>危险提示示例，带有图标</div>
          </Alert>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的警告框组件，为典型用户操作提供情景反馈消息，支持八种颜色变体、可关闭模式与淡出动画、链接、标题与图标"
      componentName="Alert"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={alertProps}
      typeDefinitions={alertTypeDefinitions}
    />
  );
};

export default AlertDoc;
