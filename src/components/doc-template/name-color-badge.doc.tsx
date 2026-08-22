import { useState } from 'react';

import type { ApiProp } from './types.ts';

import { DemoSection } from './demo-section.tsx';
import { DocTemplate } from './doc-template.tsx';
import { NameColorBadge } from './name-color-badge.tsx';

const basicCode = '<NameColorBadge name="Button" />';
const sizeCode =
  '<NameColorBadge name="Button" size="sm" /> <NameColorBadge name="Button" size="lg" />';
const stableCode = '<NameColorBadge name="Button" /> <NameColorBadge name="Button" />';
const dynamicCode =
  '<input value={name} onChange={(event) => setName(event.target.value)} />\n<NameColorBadge name={name} size="lg" />';

const nameColorBadgeProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '用于生成背景色的名称',
    name: 'name',
    type: 'string',
  },
  {
    defaultValue: "'md'",
    description: '尺寸（sm / md / lg）',
    name: 'size',
    type: "'lg' | 'md' | 'sm'",
  },
];

export const NameColorBadgeDoc = () => {
  const [name, setName] = useState('Button');

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <div className="d-flex gap-2">
          <NameColorBadge name="Button" />
          <NameColorBadge name="Card" />
          <NameColorBadge name="Dropdown" />
        </div>
      </DemoSection>
      <DemoSection code={sizeCode} title="尺寸">
        <div className="d-flex align-items-center gap-2">
          <NameColorBadge name="Button" size="sm" />
          <NameColorBadge name="Button" size="md" />
          <NameColorBadge name="Button" size="lg" />
        </div>
      </DemoSection>
      <DemoSection code={stableCode} title="稳定配色">
        <div className="d-flex align-items-center gap-3">
          <NameColorBadge name="Button" />
          <NameColorBadge name="Button" />
          <span className="text-muted small">相同名称生成相同颜色</span>
        </div>
      </DemoSection>
      <DemoSection code={dynamicCode} title="动态名称">
        <div className="d-flex flex-column gap-2" style={{ maxWidth: 360 }}>
          <input
            className="form-control"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          <NameColorBadge name={name || '示例'} size="lg" />
        </div>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于名称哈希生成稳定背景色的徽章组件，常用于组件卡片或标题标识"
      componentName="NameColorBadge"
      componentTags={['文档']}
      demoContent={demoContent}
      props={nameColorBadgeProps}
    />
  );
};

export default NameColorBadgeDoc;
