import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import centeredCode from './demos/centered.md?raw';
import customSizeCode from './demos/custom-size.md?raw';
import customStructureCode from './demos/custom-structure.md?raw';
import descriptionCode from './demos/description.md?raw';
import directionCode from './demos/direction.md?raw';
import fullscreenCode from './demos/fullscreen.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import optionsCode from './demos/options.md?raw';
import placementCode from './demos/placement.md?raw';
import scrollableCode from './demos/scrollable.md?raw';
import sizesCode from './demos/sizes.md?raw';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalDialog,
  type ModalDirection,
  ModalFooter,
  type ModalFullscreen,
  ModalHeader,
  type ModalPlacement,
  type ModalSize,
  ModalTitle,
} from './index';
import modalAnimationStatusTypeCode from './types/modal-animation-status.md?raw';
import modalBackdropTypeCode from './types/modal-backdrop.md?raw';
import modalContextValueTypeCode from './types/modal-context-value.md?raw';
import modalDirectionTypeCode from './types/modal-direction.md?raw';
import modalFullscreenTypeCode from './types/modal-fullscreen.md?raw';
import modalPartPropsTypeCode from './types/modal-part-props.md?raw';
import modalPlacementTypeCode from './types/modal-placement.md?raw';
import modalPropsTypeCode from './types/modal-props.md?raw';
import modalSizeTypeCode from './types/modal-size.md?raw';

const modalProps: ApiProp[] = [
  {
    defaultValue: 'false',
    description: '受控的打开状态，为 `true` 时模态框打开',
    name: 'isOpen',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '打开状态变化回调，模态框通过它请求关闭（如 Esc 键、遮罩点击、`ModalClose`），由使用者更新 `isOpen`',
    name: 'onOpenChange',
    type: '(isOpen: boolean) => void',
  },
  {
    defaultValue: 'true',
    description:
      '背景遮罩行为，为 `false` 时不渲染遮罩且内容区自动添加 `shadow-lg` 阴影（点击内容以外区域仍可关闭），为 `"static"` 时点击遮罩不会关闭',
    name: 'backdrop',
    type: 'ModalBackdrop',
  },
  {
    defaultValue: 'true',
    description: '是否允许通过 Esc 键关闭模态框',
    name: 'keyboard',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '弹出位置，指定后使用弹出式布局（居中、顶部、底部、左侧、右侧），不指定时使用标准 Bootstrap 布局，`size`、`fullscreen`、`centered`、`scrollable` 等布局属性仅在标准布局下生效',
    name: 'placement',
    type: 'ModalPlacement',
  },
  {
    defaultValue: '-',
    description:
      '入场动画方向，指定后内容始终在视口中部展示，`left`/`right`/`top`/`bottom` 分别从对应方向滑入一段距离，`center` 为居中缩放动画；未指定时使用默认入场动画与默认布局（是否垂直居中由 `centered` 控制）；指定 `placement` 时由 `placement` 控制布局与动画',
    name: 'direction',
    type: 'ModalDirection',
  },
  {
    defaultValue: '-',
    description: '内容区宽度，数字按像素处理',
    name: 'width',
    type: 'number | string',
  },
  {
    defaultValue: '-',
    description: '内容区高度，数字按像素处理，内容超出高度时正文区域出现滚动条',
    name: 'height',
    type: 'number | string',
  },
  {
    defaultValue: '-',
    description: '内容区最大宽度，数字按像素处理',
    name: 'maxWidth',
    type: 'number | string',
  },
  {
    defaultValue: '-',
    description: '模态框尺寸，`sm`、`lg`、`xl` 对应 300px、800px 与 1140px',
    name: 'size',
    type: 'ModalSize',
  },
  {
    defaultValue: 'false',
    description: '是否全屏显示，支持断点后缀（如 `"sm-down"`）在指定断点以下全屏',
    name: 'fullscreen',
    type: 'ModalFullscreen',
  },
  {
    defaultValue: 'false',
    description: '是否在视口中垂直居中显示模态框',
    name: 'centered',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否让正文区域可滚动，页眉与页脚保持固定',
    name: 'scrollable',
    type: 'boolean',
  },
  {
    defaultValue: '300',
    description: '打开与关闭动画时长（毫秒），系统开启减少动态效果时自动为 0',
    name: 'duration',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '无障碍标签，不提供时通过 `ModalTitle` 生成的 id 关联标题',
    name: 'ariaLabel',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '模态框根元素自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '遮罩层自定义类名',
    name: 'backdropClassName',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '对话框容器（modal-dialog）自定义类名，仅标准布局下生效',
    name: 'dialogClassName',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '内容区（modal-content）自定义类名',
    name: 'contentClassName',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '遮罩层自定义内联样式',
    name: 'backdropStyle',
    type: 'CSSProperties',
  },
  {
    defaultValue: '-',
    description: '对话框容器自定义内联样式，仅标准布局下生效',
    name: 'dialogStyle',
    type: 'CSSProperties',
  },
  {
    defaultValue: '-',
    description: '内容区自定义内联样式',
    name: 'contentStyle',
    type: 'CSSProperties',
  },
  {
    defaultValue: '-',
    description:
      '模态框内容，支持任意 React 节点，也支持直接传入 `ModalDialog` 与 `ModalContent` 自定义结构',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '透传原生 dialog 元素的所有属性（如 `onClick`、`onKeyDown` 等）',
    name: '...rest',
    type: 'DialogHTMLAttributes',
  },
];

const modalTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: modalSizeTypeCode,
    description: '模态框尺寸类型',
    name: 'ModalSize',
  },
  {
    code: modalFullscreenTypeCode,
    description: '模态框全屏类型',
    name: 'ModalFullscreen',
  },
  {
    code: modalBackdropTypeCode,
    description: '模态框遮罩行为类型',
    name: 'ModalBackdrop',
  },
  {
    code: modalPlacementTypeCode,
    description: '模态框弹出位置类型',
    name: 'ModalPlacement',
  },
  {
    code: modalDirectionTypeCode,
    description: '模态框入场动画方向类型',
    name: 'ModalDirection',
  },
  {
    code: modalAnimationStatusTypeCode,
    description: '模态框动画状态类型',
    name: 'ModalAnimationStatus',
  },
  {
    code: modalPropsTypeCode,
    description: '模态框组件属性接口',
    name: 'ModalProps',
  },
  {
    code: modalContextValueTypeCode,
    description:
      '模态框上下文，供 ModalContent、ModalTitle、ModalDescription、ModalClose 等子组件消费',
    name: 'ModalContextValue',
  },
  {
    code: modalPartPropsTypeCode,
    description:
      '模态框子组件属性接口（ModalDialog、ModalContent、ModalHeader、ModalTitle、ModalDescription、ModalBody、ModalFooter、ModalClose）',
    name: 'ModalPartProps',
  },
];

export const ModalDoc = () => {
  const [centeredOpen, setCenteredOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customSizeOpen, setCustomSizeOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [direction, setDirection] = useState<ModalDirection>('center');
  const [directionOpen, setDirectionOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState<ModalFullscreen>(true);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = useState(false);
  const [noKeyboardOpen, setNoKeyboardOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<ModalPlacement>('center');
  const [placementOpen, setPlacementOpen] = useState(false);
  const [scrollableOpen, setScrollableOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>('lg');
  const [sizeOpen, setSizeOpen] = useState(false);
  const [staticOpen, setStaticOpen] = useState(false);

  const handleConfirmDelete = () => {
    setDeleted(true);
    setConfirmOpen(false);
  };

  const handleOpenFullscreen = (value: ModalFullscreen) => {
    setFullscreen(value);
    setFullscreenOpen(true);
  };

  const handleOpenDirection = (value: ModalDirection) => {
    setDirection(value);
    setDirectionOpen(true);
  };

  const handleOpenPlacement = (value: ModalPlacement) => {
    setPlacement(value);
    setPlacementOpen(true);
  };

  const handleOpenSize = (value: ModalSize) => {
    setSize(value);
    setSizeOpen(true);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Button onClick={() => setOpen(true)} variant="primary">
          打开模态框
        </Button>
        <Modal isOpen={open} onOpenChange={setOpen}>
          <ModalHeader closeButton>
            <ModalTitle>模态框标题</ModalTitle>
          </ModalHeader>
          <ModalBody>
            模态框打开后会自动锁定背景滚动、将焦点移入模态框，并可通过 Esc
            键、遮罩点击或关闭按钮退出。
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              关闭
            </Button>
            <Button onClick={() => setOpen(false)} variant="primary">
              保存更改
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={descriptionCode} title="标题与描述">
        <Button onClick={() => setDescriptionOpen(true)} variant="primary">
          打开带描述的模态框
        </Button>
        <Modal isOpen={descriptionOpen} onOpenChange={setDescriptionOpen}>
          <ModalHeader>
            <div>
              <ModalTitle>模态框标题</ModalTitle>
              <ModalDescription>支持标题、描述、正文与页脚的自由组合</ModalDescription>
            </div>
            <ModalClose />
          </ModalHeader>
          <ModalBody>
            通过 ModalDescription 为模态框补充说明文字，自动与根元素建立无障碍关联。
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setDescriptionOpen(false)} variant="secondary">
              取消
            </Button>
            <Button onClick={() => setDescriptionOpen(false)} variant="primary">
              确定
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={sizesCode} title="可选尺寸">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => handleOpenSize('sm')} variant="outline-primary">
            小尺寸
          </Button>
          <Button onClick={() => handleOpenSize('lg')} variant="outline-primary">
            大尺寸
          </Button>
          <Button onClick={() => handleOpenSize('xl')} variant="outline-primary">
            超大尺寸
          </Button>
        </div>
        <Modal isOpen={sizeOpen} onOpenChange={setSizeOpen} size={size}>
          <ModalHeader closeButton>
            <ModalTitle>尺寸 {size}</ModalTitle>
          </ModalHeader>
          <ModalBody>通过 size 属性在 sm、lg 与 xl 三档尺寸间切换。</ModalBody>
          <ModalFooter>
            <Button onClick={() => setSizeOpen(false)} variant="primary">
              知道了
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={centeredCode} title="垂直居中">
        <Button onClick={() => setCenteredOpen(true)} variant="primary">
          打开垂直居中模态框
        </Button>
        <Modal centered isOpen={centeredOpen} onOpenChange={setCenteredOpen}>
          <ModalHeader closeButton>
            <ModalTitle>垂直居中</ModalTitle>
          </ModalHeader>
          <ModalBody>centered 为 true 时，模态框在视口中垂直居中显示。</ModalBody>
          <ModalFooter>
            <Button onClick={() => setCenteredOpen(false)} variant="primary">
              知道了
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={scrollableCode} title="滚动长内容">
        <Button onClick={() => setScrollableOpen(true)} variant="primary">
          打开滚动长内容模态框
        </Button>
        <Modal isOpen={scrollableOpen} onOpenChange={setScrollableOpen} scrollable>
          <ModalHeader closeButton>
            <ModalTitle>滚动长内容</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>scrollable 为 true 时，正文区域出现滚动条，页眉与页脚保持固定。</p>
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index}>
                第 {index + 1}{' '}
                段内容。这是用于演示滚动行为的占位文本，内容足够长时会激活正文区域的滚动条。
              </p>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setScrollableOpen(false)} variant="secondary">
              关闭
            </Button>
            <Button onClick={() => setScrollableOpen(false)} variant="primary">
              了解
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={fullscreenCode} title="全屏模态框">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => handleOpenFullscreen(true)} variant="outline-primary">
            始终全屏
          </Button>
          <Button onClick={() => handleOpenFullscreen('sm-down')} variant="outline-primary">
            小屏全屏
          </Button>
          <Button onClick={() => handleOpenFullscreen('md-down')} variant="outline-primary">
            中屏及以下全屏
          </Button>
        </div>
        <Modal fullscreen={fullscreen} isOpen={fullscreenOpen} onOpenChange={setFullscreenOpen}>
          <ModalHeader closeButton>
            <ModalTitle>全屏模态框</ModalTitle>
          </ModalHeader>
          <ModalBody>
            通过 fullscreen 属性控制全屏行为，支持断点后缀（如 sm-down）在指定断点以下全屏显示。
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setFullscreenOpen(false)} variant="primary">
              关闭
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={directionCode} title="入场方向">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => handleOpenDirection('center')} variant="outline-primary">
            居中缩放
          </Button>
          <Button onClick={() => handleOpenDirection('top')} variant="outline-primary">
            顶部滑入
          </Button>
          <Button onClick={() => handleOpenDirection('bottom')} variant="outline-primary">
            底部滑入
          </Button>
          <Button onClick={() => handleOpenDirection('left')} variant="outline-primary">
            左侧滑入
          </Button>
          <Button onClick={() => handleOpenDirection('right')} variant="outline-primary">
            右侧滑入
          </Button>
        </div>
        <Modal direction={direction} isOpen={directionOpen} onOpenChange={setDirectionOpen}>
          <ModalHeader closeButton>
            <ModalTitle>入场方向</ModalTitle>
          </ModalHeader>
          <ModalBody>
            当前入场方向：{direction}，内容始终在视口中部展示，仅动画滑入方向不同。
          </ModalBody>
        </Modal>
      </DemoSection>

      <DemoSection code={placementCode} title="弹出位置">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => handleOpenPlacement('center')} variant="outline-primary">
            居中
          </Button>
          <Button onClick={() => handleOpenPlacement('top')} variant="outline-primary">
            顶部
          </Button>
          <Button onClick={() => handleOpenPlacement('bottom')} variant="outline-primary">
            底部
          </Button>
          <Button onClick={() => handleOpenPlacement('left')} variant="outline-primary">
            左侧
          </Button>
          <Button onClick={() => handleOpenPlacement('right')} variant="outline-primary">
            右侧
          </Button>
        </div>
        <Modal isOpen={placementOpen} onOpenChange={setPlacementOpen} placement={placement}>
          <ModalHeader closeButton>
            <ModalTitle>位置演示</ModalTitle>
          </ModalHeader>
          <ModalBody>当前弹出位置：{placement}</ModalBody>
        </Modal>
      </DemoSection>

      <DemoSection code={customSizeCode} title="自定义尺寸">
        <Button onClick={() => setCustomSizeOpen(true)} variant="primary">
          打开自定义尺寸模态框
        </Button>
        <Modal
          height={320}
          isOpen={customSizeOpen}
          maxWidth="90vw"
          onOpenChange={setCustomSizeOpen}
          placement="center"
          width={560}
        >
          <ModalHeader closeButton>
            <ModalTitle>自定义尺寸</ModalTitle>
          </ModalHeader>
          <ModalBody>
            通过 width、height 与 maxWidth
            控制模态框尺寸，数字会自动转换为像素。内容超出高度时正文区域会出现滚动条。
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setCustomSizeOpen(false)} variant="primary">
              知道了
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>

      <DemoSection code={optionsCode} title="遮罩与键盘">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => setStaticOpen(true)} variant="outline-secondary">
            静态遮罩
          </Button>
          <Button onClick={() => setNoBackdropOpen(true)} variant="outline-secondary">
            无遮罩
          </Button>
          <Button onClick={() => setNoKeyboardOpen(true)} variant="outline-secondary">
            禁用 Esc
          </Button>
        </div>
        <Modal backdrop="static" isOpen={staticOpen} onOpenChange={setStaticOpen}>
          <ModalHeader closeButton>
            <ModalTitle>静态遮罩</ModalTitle>
          </ModalHeader>
          <ModalBody>backdrop 为 static 时点击遮罩不会关闭，只能通过按钮或 Esc 退出。</ModalBody>
        </Modal>
        <Modal backdrop={false} isOpen={noBackdropOpen} onOpenChange={setNoBackdropOpen}>
          <ModalHeader closeButton>
            <ModalTitle>无遮罩</ModalTitle>
          </ModalHeader>
          <ModalBody>
            backdrop 为 false 时不渲染背景遮罩，内容区自动添加 shadow-lg
            阴影，点击内容以外区域仍可关闭。
          </ModalBody>
        </Modal>
        <Modal isOpen={noKeyboardOpen} keyboard={false} onOpenChange={setNoKeyboardOpen}>
          <ModalHeader closeButton>
            <ModalTitle>禁用 Esc</ModalTitle>
          </ModalHeader>
          <ModalBody>keyboard 为 false 时按 Esc 键不会关闭模态框。</ModalBody>
        </Modal>
      </DemoSection>

      <DemoSection code={customStructureCode} title="自定义结构">
        <Button onClick={() => setCustomOpen(true)} variant="primary">
          打开自定义结构模态框
        </Button>
        <Modal isOpen={customOpen} onOpenChange={setCustomOpen}>
          <ModalDialog scrollable size="lg">
            <ModalContent>
              <ModalHeader closeButton>
                <ModalTitle>自定义结构</ModalTitle>
              </ModalHeader>
              <ModalBody>
                通过 ModalDialog 与 ModalContent 自行组合模态框结构，动画状态会自动传递给
                ModalContent。
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setCustomOpen(false)} variant="primary">
                  知道了
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalDialog>
        </Modal>
      </DemoSection>

      <DemoSection code={interactiveCode} title="确认对话框">
        <div className="d-flex align-items-center gap-2">
          <Button onClick={() => setConfirmOpen(true)} variant="danger">
            删除项目
          </Button>
          {deleted && <span className="text-success">项目已删除</span>}
        </div>
        <Modal isOpen={confirmOpen} onOpenChange={setConfirmOpen}>
          <ModalHeader closeButton>
            <ModalTitle>确认删除</ModalTitle>
          </ModalHeader>
          <ModalBody>删除后无法恢复，确定要继续吗？</ModalBody>
          <ModalFooter>
            <Button onClick={() => setConfirmOpen(false)} variant="secondary">
              取消
            </Button>
            <Button onClick={handleConfirmDelete} variant="danger">
              确认删除
            </Button>
          </ModalFooter>
        </Modal>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 React Portal 的模态框组件，支持尺寸、全屏、垂直居中、滚动布局与多种弹出位置，内置焦点管理、背景滚动锁定与自定义过渡动画，可通过页眉、正文、页脚等子组件自由组合内容"
      componentName="Modal"
      componentTags={['基础', '对话框']}
      demoContent={demoContent}
      props={modalProps}
      typeDefinitions={modalTypeDefinitions}
    />
  );
};

export default ModalDoc;
