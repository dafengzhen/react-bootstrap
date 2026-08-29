import {
  Bell,
  Bold,
  Bookmark,
  Check,
  Download,
  ExternalLink,
  Heart,
  House,
  Italic,
  PenLine,
  Plus,
  RefreshCw,
  Save,
  Search,
  Share2,
  Star,
  ThumbsUp,
  Trash2,
  Underline,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { TooltipTrigger } from '../tooltip';
import basicCode from './demos/basic.md?raw';
import combinedCode from './demos/combined.md?raw';
import customClassesCode from './demos/custom-classes.md?raw';
import disabledCode from './demos/disabled.md?raw';
import groupCode from './demos/group.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import linksCode from './demos/links.md?raw';
import loadingCode from './demos/loading.md?raw';
import outlineVariantsCode from './demos/outline-variants.md?raw';
import shapesCode from './demos/shapes.md?raw';
import sizesCode from './demos/sizes.md?raw';
import toggleCode from './demos/toggle.md?raw';
import tooltipCode from './demos/tooltip.md?raw';
import variantsCode from './demos/variants.md?raw';
import { IconButton } from './icon-button';
import iconButtonPropsTypeCode from './types/icon-button-props.md?raw';
import iconButtonShapeTypeCode from './types/icon-button-shape.md?raw';

const iconButtonProps: ApiProp[] = [
  {
    defaultValue: '-',
    description:
      '无障碍标签：设置 `aria-label` 与悬停提示 `title`；图标按钮没有可见文字，建议始终提供',
    name: 'label',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '按钮视觉变体，对应 Bootstrap 的 `btn-*` 类；不提供时仅应用基础 `btn` 类',
    name: 'variant',
    type: 'ButtonVariant',
  },
  {
    defaultValue: '-',
    description: '按钮大小，可选 `sm` 或 `lg`，按钮始终等宽等高',
    name: 'size',
    type: 'ButtonSize',
  },
  {
    defaultValue: "'rounded'",
    description:
      '按钮形状：`circle` 应用 `rounded-circle`，`square` 应用 `rounded-0`，`rounded` 保留默认圆角',
    name: 'shape',
    type: 'IconButtonShape',
  },
  {
    defaultValue: '-',
    description: '激活状态：应用 `active` 类；与 `toggle` 配合时作为受控的按压状态',
    name: 'active',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '`toggle` 按钮在非受控模式下的初始按压状态',
    name: 'defaultActive',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '切换按钮：管理 `aria-pressed` 与 `active` 类，未提供 `active` 时点击自动切换',
    name: 'toggle',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description:
      '是否禁用按钮；渲染为 `a` 时会应用 `disabled` 类、`aria-disabled` 与 `tabIndex=-1`',
    name: 'disabled',
    type: 'boolean',
  },
  {
    defaultValue: 'false',
    description: '是否显示加载状态：图标替换为旋转加载指示器，按钮不可交互',
    name: 'loading',
    type: 'boolean',
  },
  {
    defaultValue: "'button'",
    description: '原生 `type` 属性，仅对 `button` 与 `input` 元素生效',
    name: 'type',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '链接地址，提供后自动渲染为 `a` 元素；可配合 `download`、`rel`、`target` 使用',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '提示浏览器下载链接资源而非导航，值为建议的文件名',
    name: 'download',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '链接与目标资源的关系，例如 `noopener`、`nofollow`',
    name: 'rel',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '链接打开的目标窗口，例如 `_blank`、`_self`',
    name: 'target',
    type: 'string',
  },
  {
    defaultValue: "'button'",
    description: '渲染的根元素，可传入 `a`、`input` 或任意组件',
    name: 'as',
    type: 'ElementType',
  },
  {
    defaultValue: '-',
    description: '按钮内容，通常为单个图标元素（如 lucide-react 图标）',
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
    description: '原生 button 元素的所有属性（如 `onClick`、`onFocus` 等）',
    name: '...rest',
    type: 'ButtonHTMLAttributes',
  },
];

const iconButtonTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: iconButtonShapeTypeCode,
    description: '图标按钮形状类型',
    name: 'IconButtonShape',
  },
  {
    code: iconButtonPropsTypeCode,
    description: '图标按钮组件属性接口',
    name: 'IconButtonProps',
  },
];

export const IconButtonDoc = () => {
  const savingTimerRef = useRef<null | number>(null);
  const [liked, setLiked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(
    () => () => {
      if (savingTimerRef.current !== null) {
        clearTimeout(savingTimerRef.current);
      }
    },
    [],
  );

  const handleSaveClick = () => {
    setSaving(true);
    if (savingTimerRef.current !== null) {
      clearTimeout(savingTimerRef.current);
    }
    savingTimerRef.current = setTimeout(() => {
      savingTimerRef.current = null;
      setSaving(false);
    }, 3000);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="搜索">
            <Search size={18} />
          </IconButton>
          <IconButton label="收藏">
            <Heart size={18} />
          </IconButton>
          <IconButton label="通知">
            <Bell size={18} />
          </IconButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          图标按钮没有可见文字，`label` 会同时设置为 `aria-label` 与
          `title`，供屏幕阅读器朗读并显示悬停提示
        </p>
      </DemoSection>

      <DemoSection code={variantsCode} title="变体">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="主要" variant="primary">
            <Star size={18} />
          </IconButton>
          <IconButton label="次要" variant="secondary">
            <Star size={18} />
          </IconButton>
          <IconButton label="成功" variant="success">
            <Star size={18} />
          </IconButton>
          <IconButton label="危险" variant="danger">
            <Star size={18} />
          </IconButton>
          <IconButton label="警告" variant="warning">
            <Star size={18} />
          </IconButton>
          <IconButton label="信息" variant="info">
            <Star size={18} />
          </IconButton>
          <IconButton label="亮色" variant="light">
            <Star size={18} />
          </IconButton>
          <IconButton label="暗色" variant="dark">
            <Star size={18} />
          </IconButton>
          <IconButton label="链接" variant="link">
            <Star size={18} />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={outlineVariantsCode} title="轮廓变体">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="主要" variant="outline-primary">
            <Star size={18} />
          </IconButton>
          <IconButton label="次要" variant="outline-secondary">
            <Star size={18} />
          </IconButton>
          <IconButton label="成功" variant="outline-success">
            <Star size={18} />
          </IconButton>
          <IconButton label="危险" variant="outline-danger">
            <Star size={18} />
          </IconButton>
          <IconButton label="警告" variant="outline-warning">
            <Star size={18} />
          </IconButton>
          <IconButton label="信息" variant="outline-info">
            <Star size={18} />
          </IconButton>
          <IconButton label="亮色" variant="outline-light">
            <Star size={18} />
          </IconButton>
          <IconButton label="暗色" variant="outline-dark">
            <Star size={18} />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={shapesCode} title="形状">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="圆形" shape="circle" variant="primary">
            <Plus size={18} />
          </IconButton>
          <IconButton label="圆角" shape="rounded" variant="primary">
            <Plus size={18} />
          </IconButton>
          <IconButton label="方形" shape="square" variant="primary">
            <Plus size={18} />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <IconButton label="小尺寸" size="sm" variant="primary">
            <Search size={14} />
          </IconButton>
          <IconButton label="默认尺寸" variant="primary">
            <Search size={18} />
          </IconButton>
          <IconButton label="大尺寸" size="lg" variant="primary">
            <Search size={22} />
          </IconButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          按钮始终等宽等高，请按尺寸搭配图标大小（sm 推荐 14、默认推荐 18、lg 推荐 22）
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <div className="d-flex flex-wrap gap-2">
          <IconButton disabled label="禁用按钮" variant="primary">
            <Trash2 size={18} />
          </IconButton>
          <IconButton disabled label="禁用轮廓按钮" variant="outline-danger">
            <Trash2 size={18} />
          </IconButton>
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <IconButton as="a" disabled href="#" label="禁用链接" role="button" variant="primary">
            <Trash2 size={18} />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={toggleCode} title="切换状态">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="收藏" toggle variant="outline-primary">
            <Bookmark size={18} />
          </IconButton>
          <IconButton defaultActive label="预激活" toggle variant="outline-danger">
            <Heart size={18} />
          </IconButton>
          <IconButton disabled label="禁用切换" toggle>
            <Bookmark size={18} />
          </IconButton>
          <IconButton label="点赞" toggle variant="primary">
            <ThumbsUp size={18} />
          </IconButton>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          切换状态由 React 管理（无需引入 Bootstrap JS）：点击自动切换 `active` 类与
          `aria-pressed`，受控场景使用 `active`
        </p>
      </DemoSection>

      <DemoSection code={loadingCode} title="加载状态">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="刷新" loading variant="primary">
            <RefreshCw size={18} />
          </IconButton>
          <IconButton label="下载" loading variant="outline-success">
            <Download size={18} />
          </IconButton>
          <IconButton disabled label="删除" loading variant="danger">
            <Trash2 size={18} />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={linksCode} title="链接按钮">
        <div className="d-flex flex-wrap gap-2">
          {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role */}
          <IconButton href="#" label="首页" role="button" variant="primary">
            <House size={18} />
          </IconButton>
          <IconButton href="#" label="外部链接" target="_blank" variant="outline-primary">
            <ExternalLink size={18} />
          </IconButton>
          <IconButton download="guide.pdf" href="/guide.pdf" label="下载指南" variant="success">
            <Download size={18} />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={groupCode} title="组合使用">
        <div className="d-flex flex-column align-items-start gap-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <ButtonGroup>
              <IconButton label="加粗">
                <Bold size={16} />
              </IconButton>
              <IconButton label="斜体">
                <Italic size={16} />
              </IconButton>
              <IconButton label="下划线">
                <Underline size={16} />
              </IconButton>
            </ButtonGroup>
            <ButtonGroup size="sm">
              <IconButton label="加粗">
                <Bold size={14} />
              </IconButton>
              <IconButton label="斜体">
                <Italic size={14} />
              </IconButton>
              <IconButton label="下划线">
                <Underline size={14} />
              </IconButton>
            </ButtonGroup>
          </div>
          <ButtonGroup>
            <Button variant="primary">
              <Plus size={16} /> 新建
            </Button>
            <IconButton label="删除" variant="danger">
              <Trash2 size={16} />
            </IconButton>
          </ButtonGroup>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `IconButton` 可与 `ButtonGroup`、`Button`
          自由组合，例如文字按钮与图标按钮构成的工具栏；即使按钮组被父容器拉伸，图标按钮也始终保持正方形
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex flex-wrap gap-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <IconButton
              active={liked}
              label={liked ? '取消收藏' : '收藏'}
              onClick={() => setLiked((prev) => !prev)}
              toggle
              variant={liked ? 'danger' : 'outline-danger'}
            >
              <Heart fill={liked ? 'currentColor' : 'none'} size={18} />
            </IconButton>
            <span className="text-muted small">{liked ? '已收藏' : '点击收藏'}</span>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <IconButton label="保存" loading={saving} onClick={handleSaveClick} variant="primary">
              <Save size={18} />
            </IconButton>
            <span className="text-muted small">{saving ? '保存中...' : '点击触发 3 秒保存'}</span>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={tooltipCode} title="Tooltip 提示">
        <div className="d-flex flex-wrap gap-2">
          <TooltipTrigger placement="top" title="搜索">
            <IconButton label="搜索" variant="outline-primary">
              <Search size={18} />
            </IconButton>
          </TooltipTrigger>
          <TooltipTrigger placement="top" title="编辑">
            <IconButton label="编辑" variant="outline-secondary">
              <PenLine size={18} />
            </IconButton>
          </TooltipTrigger>
          <TooltipTrigger placement="top" title="分享">
            <IconButton label="分享" variant="outline-success">
              <Share2 size={18} />
            </IconButton>
          </TooltipTrigger>
        </div>
      </DemoSection>

      <DemoSection code={customClassesCode} title="自定义样式">
        <div className="d-flex flex-wrap gap-2">
          <IconButton className="shadow-sm" label="带阴影" variant="secondary">
            <Search size={18} />
          </IconButton>
          <IconButton className="rounded-pill" label="胶囊形状" variant="primary">
            <Plus size={18} />
          </IconButton>
          <IconButton className="fs-6" label="大图标" variant="outline-success">
            <Search />
          </IconButton>
          <IconButton className="fs-2" label="超大图标" variant="outline-success">
            <Search />
          </IconButton>
        </div>
      </DemoSection>

      <DemoSection code={combinedCode} title="属性组合">
        <div className="d-flex flex-wrap gap-2">
          <IconButton label="圆形主要大按钮" shape="circle" size="lg" variant="primary">
            <Plus size={22} />
          </IconButton>
          <IconButton label="小号方形危险按钮" shape="square" size="sm" variant="outline-danger">
            <Trash2 size={14} />
          </IconButton>
          <IconButton label="圆形加载按钮" loading shape="circle" variant="success">
            <Check size={18} />
          </IconButton>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的图标按钮组件，用于仅含图标的紧凑操作按钮，支持多种变体、形状、尺寸与状态，可渲染为 button 或 a 元素，并提供切换与加载能力"
      componentName="IconButton"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={iconButtonProps}
      typeDefinitions={iconButtonTypeDefinitions}
    />
  );
};

export default IconButtonDoc;
