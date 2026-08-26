import { useState } from 'react';

import type { AvatarProps } from './types';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import basicCode from './demos/basic.md?raw';
import borderCode from './demos/border.md?raw';
import fallbackCode from './demos/fallback.md?raw';
import groupMaxCode from './demos/group-max.md?raw';
import groupSettingsCode from './demos/group-settings.md?raw';
import groupCode from './demos/group.md?raw';
import iconsCode from './demos/icons.md?raw';
import initialsCode from './demos/initials.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import shapesCode from './demos/shapes.md?raw';
import sizesCode from './demos/sizes.md?raw';
import variantsCode from './demos/variants.md?raw';
import avatarBgTypeCode from './types/avatar-bg.md?raw';
import avatarGroupContextValueTypeCode from './types/avatar-group-context-value.md?raw';
import avatarGroupPropsTypeCode from './types/avatar-group-props.md?raw';
import avatarPropsTypeCode from './types/avatar-props.md?raw';
import avatarShapeTypeCode from './types/avatar-shape.md?raw';
import avatarSizeTypeCode from './types/avatar-size.md?raw';

const AVATAR_IMAGE_SOURCES = Array.from(
  { length: 6 },
  (_, index) => `https://picsum.photos/seed/rbs-avatar-${index + 1}/96/96`,
);

const AVATAR_PRESETS: AvatarProps[] = [
  { alt: '图片头像', src: 'https://picsum.photos/seed/rbs-avatar-user/96/96' },
  { name: '张三' },
  { bg: 'info', children: '👋' },
];

const avatarProps: ApiProp[] = [
  {
    component: 'Avatar',
    defaultValue: '-',
    description: '图片替代文本；未提供时依次回退为 `name`（若提供）和空字符串',
    name: 'alt',
    type: 'string',
  },
  {
    component: 'Avatar',
    defaultValue: "'span'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Avatar',
    defaultValue: "'secondary'",
    description: '头像背景色变体，对应 Bootstrap 的 `text-bg-*` 工具类，用于兜底内容的底色',
    name: 'bg',
    type: 'AvatarBg',
  },
  {
    component: 'Avatar',
    defaultValue: 'false',
    description: '是否显示描边，描边颜色取自 `--bs-body-bg`，用于与页面背景区分',
    name: 'border',
    type: 'boolean',
  },
  {
    component: 'Avatar',
    defaultValue: '-',
    description: '兜底内容，优先于 `name` 自动生成的缩写',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Avatar',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Avatar',
    defaultValue: '-',
    description:
      '用户名称，自动生成缩写：中文取首字（姓）、英文取各单词首字母；未提供任何内容时显示「?」',
    name: 'name',
    type: 'string',
  },
  {
    component: 'Avatar',
    defaultValue: "'circle'",
    description: '头像形状，`circle` 圆形、`rounded` 圆角方形、`square` 方形',
    name: 'shape',
    type: 'AvatarShape',
  },
  {
    component: 'Avatar',
    defaultValue: "'md'",
    description: '头像尺寸，预设值对应 24/32/40/48/64 像素，也可传入数字指定像素大小',
    name: 'size',
    type: 'AvatarSize | number',
  },
  {
    component: 'Avatar',
    defaultValue: '-',
    description: '图片地址；加载失败时自动回退到 `children` 或 `name` 生成的缩写',
    name: 'src',
    type: 'string',
  },
  {
    component: 'Avatar',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `title`、`style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'AvatarGroup',
    defaultValue: "'div'",
    description: '渲染的根元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '组内 Avatar 的默认背景色，可被单个 Avatar 的 `bg` 覆盖',
    name: 'bg',
    type: 'AvatarBg',
  },
  {
    component: 'AvatarGroup',
    defaultValue: 'true',
    description: '组内 Avatar 的默认描边，堆叠时用于彼此分隔，可被单个 Avatar 的 `border` 覆盖',
    name: 'border',
    type: 'boolean',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '组内头像，通常为多个 Avatar',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '自定义类名，作用于根容器',
    name: 'className',
    type: 'string',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '最多显示的头像数量（含「+N」占位头像），超出部分折叠为「+N」',
    name: 'max',
    type: 'number',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '8',
    description: '头像之间的重叠距离，传入数字表示像素，也可传入任意 CSS 长度',
    name: 'overlap',
    type: 'number | string',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '组内 Avatar 的默认形状，可被单个 Avatar 的 `shape` 覆盖',
    name: 'shape',
    type: 'AvatarShape',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '组内 Avatar 的默认尺寸，可被单个 Avatar 的 `size` 覆盖',
    name: 'size',
    type: 'AvatarSize | number',
  },
  {
    component: 'AvatarGroup',
    defaultValue: '-',
    description: '根容器的所有原生属性（如 `style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const avatarTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: avatarBgTypeCode,
    description: '头像背景色变体类型',
    name: 'AvatarBg',
  },
  {
    code: avatarGroupContextValueTypeCode,
    description: '头像组上下文值接口，供 `useAvatarGroup` 使用',
    name: 'AvatarGroupContextValue',
  },
  {
    code: avatarGroupPropsTypeCode,
    description: '头像组组件属性接口',
    name: 'AvatarGroupProps',
  },
  {
    code: avatarPropsTypeCode,
    description: '头像组件属性接口',
    name: 'AvatarProps',
  },
  {
    code: avatarShapeTypeCode,
    description: '头像形状类型',
    name: 'AvatarShape',
  },
  {
    code: avatarSizeTypeCode,
    description: '头像尺寸类型',
    name: 'AvatarSize',
  },
];

export const AvatarDoc = () => {
  const [presetIndex, setPresetIndex] = useState(0);

  const handleSwitchPreset = () => {
    setPresetIndex((prev) => (prev + 1) % AVATAR_PRESETS.length);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="图片头像">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          {AVATAR_IMAGE_SOURCES.slice(0, 4).map((src, index) => (
            <Avatar alt={`用户头像 ${index + 1}`} key={index} src={src} />
          ))}
        </div>
        <p className="mb-0 mt-3 text-muted small">
          传入 `src` 显示图片头像，图片会以裁剪方式填充整个头像区域
        </p>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar name="张三" size="xs" />
          <Avatar name="张三" size="sm" />
          <Avatar name="张三" size="md" />
          <Avatar name="张三" size="lg" />
          <Avatar name="张三" size="xl" />
          <Avatar name="张三" size={96} />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          预设尺寸对应 24/32/40/48/64 像素，也可传入数字自定义像素大小，文字会随尺寸等比缩放
        </p>
      </DemoSection>

      <DemoSection code={shapesCode} title="形状">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar name="张三" shape="circle" />
          <Avatar name="张三" shape="rounded" />
          <Avatar name="张三" shape="square" />
        </div>
      </DemoSection>

      <DemoSection code={variantsCode} title="背景色变体">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar bg="primary" name="Primary" />
          <Avatar bg="secondary" name="Secondary" />
          <Avatar bg="success" name="Success" />
          <Avatar bg="danger" name="Danger" />
          <Avatar bg="warning" name="Warning" />
          <Avatar bg="info" name="Info" />
          <Avatar bg="light" name="Light" />
          <Avatar bg="dark" name="Dark" />
        </div>
      </DemoSection>

      <DemoSection code={initialsCode} title="名称缩写">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar name="张三" />
          <Avatar name="John Doe" />
          <Avatar name="Marie Curie" />
          <Avatar name="Admin" />
          <Avatar>RB</Avatar>
          <Avatar />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过 `name` 自动生成缩写：中文取首字（姓）、英文取各单词首字母；提供 `children`
          时优先使用自定义内容，两者都未提供时显示「?」
        </p>
      </DemoSection>

      <DemoSection code={fallbackCode} title="图片加载失败回退">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar name="张三" src="https://invalid.example.com/avatar.png" />
          <Avatar bg="info" name="John Doe" src="https://invalid.example.com/avatar.png" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          图片加载失败时自动回退到 `children` 或 `name` 生成的缩写，避免出现空头像
        </p>
      </DemoSection>

      <DemoSection code={borderCode} title="描边">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar border name="张三" src="https://picsum.photos/seed/rbs-avatar-border/96/96" />
          <Avatar bg="primary" border name="张三" />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `border` 使用 `--bs-body-bg` 颜色描边，在图片或彩色背景上与页面自然分隔
        </p>
      </DemoSection>

      <DemoSection code={iconsCode} title="自定义内容">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Avatar bg="success">✓</Avatar>
          <Avatar bg="warning">📷</Avatar>
          <Avatar bg="dark">JS</Avatar>
          <Avatar bg="danger">!</Avatar>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          `children` 支持任意内容，可用于展示状态图标、等级标记等
        </p>
      </DemoSection>

      <DemoSection code={groupCode} title="头像组">
        <AvatarGroup>
          <Avatar alt="成员 1" src={AVATAR_IMAGE_SOURCES[0]} />
          <Avatar alt="成员 2" src={AVATAR_IMAGE_SOURCES[1]} />
          <Avatar alt="成员 3" src={AVATAR_IMAGE_SOURCES[2]} />
        </AvatarGroup>
        <p className="mb-0 mt-3 text-muted small">
          使用 AvatarGroup 将多个头像堆叠展示，默认以 8px 重叠并自动添加分隔描边
        </p>
      </DemoSection>

      <DemoSection code={groupMaxCode} title="数量上限">
        <AvatarGroup max={4}>
          {AVATAR_IMAGE_SOURCES.map((src, index) => (
            <Avatar alt={`成员 ${index + 1}`} key={index} src={src} />
          ))}
        </AvatarGroup>
        <p className="mb-0 mt-3 text-muted small">
          通过 `max` 限制显示数量，超出部分折叠为「+N」占位头像
        </p>
      </DemoSection>

      <DemoSection code={groupSettingsCode} title="组级设置">
        <AvatarGroup bg="primary" overlap={16} shape="rounded" size="lg">
          <Avatar name="张三" />
          <Avatar name="李四" />
          <Avatar name="王五" />
        </AvatarGroup>
        <p className="mb-0 mt-3 text-muted small">
          AvatarGroup 上的 `bg`、`shape`、`size`、`border` 会作为组内 Avatar 的默认值，单个 Avatar
          可通过同名属性覆盖
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="交互演示">
        <div className="d-flex align-items-center gap-3">
          <Avatar {...AVATAR_PRESETS[presetIndex]} />
          <Button onClick={handleSwitchPreset} variant="outline-secondary">
            切换头像
          </Button>
          <span className="text-muted small">在图片、名称缩写与自定义内容之间切换</span>
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的头像组件，用于展示用户图片或名称缩写，支持图片加载失败自动回退、多种尺寸与形状、背景色变体与描边，并通过 AvatarGroup 提供堆叠展示、数量折叠和组级默认配置"
      componentName="Avatar"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={avatarProps}
      typeDefinitions={avatarTypeDefinitions}
    />
  );
};

export default AvatarDoc;
