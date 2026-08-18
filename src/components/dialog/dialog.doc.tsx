import { useState } from 'react';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import optionsCode from './demos/options.md?raw';
import placementsCode from './demos/placements.md?raw';
import sizesCode from './demos/sizes.md?raw';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogPlacement,
  DialogTitle,
} from './index';
import dialogAnimationStatusTypeCode from './types/dialog-animation-status.md?raw';
import dialogContextValueTypeCode from './types/dialog-context-value.md?raw';
import dialogPartPropsTypeCode from './types/dialog-part-props.md?raw';
import dialogPlacementTypeCode from './types/dialog-placement.md?raw';
import dialogPropsTypeCode from './types/dialog-props.md?raw';

const dialogProps: ApiProp[] = [
  {
    defaultValue: 'false',
    description: '受控的打开状态，为 `true` 时对话框打开',
    name: 'isOpen',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description:
      '打开状态变化回调，对话框通过它请求关闭（如 Esc 键、遮罩点击、`DialogClose`），由使用者更新 `isOpen`',
    name: 'onOpenChange',
    type: '(isOpen: boolean) => void',
  },
  {
    defaultValue: "'center'",
    description: '对话框弹出位置，决定内容动画的入场方向',
    name: 'placement',
    type: 'DialogPlacement',
  },
  {
    defaultValue: 'true',
    description: '是否显示半透明背景遮罩，为 `false` 时遮罩完全透明',
    name: 'showBackdrop',
    type: 'boolean',
  },
  {
    defaultValue: 'true',
    description: '点击遮罩（内容区域之外）时是否关闭对话框',
    name: 'closeOnBackdropClick',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: '对话框内容宽度，数字按像素处理',
    name: 'width',
    type: 'number | string',
  },
  {
    defaultValue: '-',
    description: '对话框内容高度，数字按像素处理',
    name: 'height',
    type: 'number | string',
  },
  {
    defaultValue: '-',
    description: '对话框内容最大宽度，数字按像素处理',
    name: 'maxWidth',
    type: 'number | string',
  },
  {
    defaultValue: '300',
    description: '打开与关闭动画时长（毫秒），系统开启减少动态效果时自动为 0',
    name: 'duration',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '无障碍标签，不提供时通过 `DialogTitle` 生成的 id 关联标题',
    name: 'ariaLabel',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '对话框根元素自定义类名',
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
    description: '内容区自定义类名',
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
    description: '内容区自定义内联样式',
    name: 'contentStyle',
    type: 'CSSProperties',
  },
  {
    defaultValue: '-',
    description: '对话框内容，支持任意 React 节点',
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

const dialogTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: dialogPlacementTypeCode,
    description: '对话框弹出位置类型',
    name: 'DialogPlacement',
  },
  {
    code: dialogAnimationStatusTypeCode,
    description: '对话框动画状态类型',
    name: 'DialogAnimationStatus',
  },
  {
    code: dialogPropsTypeCode,
    description: '对话框组件属性接口',
    name: 'DialogProps',
  },
  {
    code: dialogContextValueTypeCode,
    description: '对话框上下文，供 DialogTitle、DialogDescription、DialogClose 等子组件消费',
    name: 'DialogContextValue',
  },
  {
    code: dialogPartPropsTypeCode,
    description:
      '对话框子组件属性接口（DialogHeader、DialogBody、DialogFooter、DialogTitle、DialogDescription、DialogClose）',
    name: 'DialogPartProps',
  },
];

export const DialogDoc = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [noMaskCloseOpen, setNoMaskCloseOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DialogPlacement>('center');
  const [placementOpen, setPlacementOpen] = useState(false);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [transparentOpen, setTransparentOpen] = useState(false);

  const handleConfirmDelete = () => {
    setDeleted(true);
    setConfirmOpen(false);
  };

  const handleOpenPlacement = (value: DialogPlacement) => {
    setPlacement(value);
    setPlacementOpen(true);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Button onClick={() => setOpen(true)} variant="primary">
          打开对话框
        </Button>
        <Dialog isOpen={open} onOpenChange={setOpen}>
          <DialogHeader>
            <div>
              <DialogTitle>对话框标题</DialogTitle>
              <DialogDescription>支持标题、描述、正文与页脚的自由组合</DialogDescription>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            对话框打开后会自动锁定背景滚动、将焦点移入对话框，并可通过 Esc 键、遮罩点击或关闭按钮退出。
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              取消
            </Button>
            <Button onClick={() => setOpen(false)} variant="primary">
              确定
            </Button>
          </DialogFooter>
        </Dialog>
      </DemoSection>

      <DemoSection code={placementsCode} title="弹出位置">
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
        <Dialog isOpen={placementOpen} onOpenChange={setPlacementOpen} placement={placement}>
          <DialogHeader>
            <DialogTitle>位置演示</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogBody>当前弹出位置：{placement}</DialogBody>
        </Dialog>
      </DemoSection>

      <DemoSection code={optionsCode} title="遮罩与关闭行为">
        <div className="d-flex flex-wrap gap-2">
          <Button onClick={() => setTransparentOpen(true)} variant="outline-secondary">
            无背景遮罩
          </Button>
          <Button onClick={() => setNoMaskCloseOpen(true)} variant="outline-secondary">
            禁止点击遮罩关闭
          </Button>
        </div>
        <Dialog isOpen={transparentOpen} onOpenChange={setTransparentOpen} showBackdrop={false}>
          <DialogHeader>
            <DialogTitle>透明遮罩</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            showBackdrop 为 false 时遮罩背景完全透明，仍可通过 Esc 或关闭按钮退出。
          </DialogBody>
        </Dialog>
        <Dialog
          closeOnBackdropClick={false}
          isOpen={noMaskCloseOpen}
          onOpenChange={setNoMaskCloseOpen}
        >
          <DialogHeader>
            <DialogTitle>禁止遮罩关闭</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogBody>点击遮罩不会关闭对话框，只能通过关闭按钮或 Esc 退出。</DialogBody>
        </Dialog>
      </DemoSection>

      <DemoSection code={sizesCode} title="自定义尺寸">
        <Button onClick={() => setSizesOpen(true)} variant="primary">
          打开自定义尺寸对话框
        </Button>
        <Dialog
          height={320}
          isOpen={sizesOpen}
          maxWidth="90vw"
          onOpenChange={setSizesOpen}
          width={560}
        >
          <DialogHeader>
            <DialogTitle>自定义尺寸</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            通过 width、height 与 maxWidth
            控制对话框尺寸，数字会自动转换为像素。内容超出高度时正文区域会出现滚动条。
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setSizesOpen(false)} variant="primary">
              知道了
            </Button>
          </DialogFooter>
        </Dialog>
      </DemoSection>

      <DemoSection code={interactiveCode} title="确认对话框">
        <div className="d-flex align-items-center gap-2">
          <Button onClick={() => setConfirmOpen(true)} variant="danger">
            删除项目
          </Button>
          {deleted && <span className="text-success">项目已删除</span>}
        </div>
        <Dialog isOpen={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogBody>删除后无法恢复，确定要继续吗？</DialogBody>
          <DialogFooter>
            <Button onClick={() => setConfirmOpen(false)} variant="secondary">
              取消
            </Button>
            <Button onClick={handleConfirmDelete} variant="danger">
              确认删除
            </Button>
          </DialogFooter>
        </Dialog>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 React Portal 的对话框组件，支持多种弹出位置、焦点管理、背景滚动锁定与过渡动画，可通过页眉、正文、页脚等子组件自由组合内容"
      componentName="Dialog"
      componentTags={['基础', '对话框']}
      demoContent={demoContent}
      props={dialogProps}
      typeDefinitions={dialogTypeDefinitions}
    />
  );
};

export default DialogDoc;
