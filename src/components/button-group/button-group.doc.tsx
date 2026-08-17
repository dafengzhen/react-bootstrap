import { type ChangeEvent, useState } from 'react';

import { Button } from '../button';
import buttonSizeTypeCode from '../button/types/button-size.md?raw';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import { ButtonGroup } from './button-group';
import { ButtonToolbar } from './button-toolbar';
import basicCode from './demos/basic.md?raw';
import checkboxCode from './demos/checkbox.md?raw';
import combinedCode from './demos/combined.md?raw';
import mixedVariantsCode from './demos/mixed-variants.md?raw';
import outlineVariantsCode from './demos/outline-variants.md?raw';
import radioCode from './demos/radio.md?raw';
import sizesCode from './demos/sizes.md?raw';
import toolbarCode from './demos/toolbar.md?raw';
import verticalCode from './demos/vertical.md?raw';
import buttonGroupPropsTypeCode from './types/button-group-props.md?raw';
import buttonToolbarPropsTypeCode from './types/button-toolbar-props.md?raw';

const buttonGroupProps: ApiProp[] = [
  {
    defaultValue: 'false',
    description: 'ButtonGroup：是否垂直排列组内按钮，默认为水平排列',
    name: 'vertical',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: 'ButtonGroup：统一设置组内所有按钮的尺寸，可选 `sm` 或 `lg`',
    name: 'size',
    type: 'ButtonSize',
  },
  {
    defaultValue: "'group' / 'toolbar'",
    description: 'ARIA 角色：ButtonGroup 默认为 `group`，ButtonToolbar 默认为 `toolbar`',
    name: 'role',
    type: 'AriaRole',
  },
  {
    defaultValue: '-',
    description: '无障碍标签，向屏幕阅读器描述分组用途（两个组件均支持）',
    name: 'aria-label',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '组内子元素，通常为 `Button` 组件或复选/单选按钮组',
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
    description: '原生 div 元素的所有属性（如 `onClick`、`onFocus` 等）',
    name: '...rest',
    type: 'HTMLAttributes<HTMLDivElement>',
  },
];

const buttonGroupTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: buttonGroupPropsTypeCode,
    description: '按钮组组件属性接口',
    name: 'ButtonGroupProps',
  },
  {
    code: buttonSizeTypeCode,
    description: '按钮尺寸类型，复用自 Button 组件',
    name: 'ButtonSize',
  },
  {
    code: buttonToolbarPropsTypeCode,
    description: '按钮工具栏组件属性接口',
    name: 'ButtonToolbarProps',
  },
];

export const ButtonGroupDoc = () => {
  const [checkboxValues, setCheckboxValues] = useState<string[]>(['1']);
  const [radioValue, setRadioValue] = useState('1');

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    setCheckboxValues((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <ButtonGroup aria-label="基础按钮组">
          <Button variant="primary">左</Button>
          <Button variant="primary">中</Button>
          <Button variant="primary">右</Button>
        </ButtonGroup>
      </DemoSection>

      <DemoSection code={mixedVariantsCode} title="混合样式">
        <ButtonGroup aria-label="混合样式按钮组">
          <Button variant="danger">左</Button>
          <Button variant="warning">中</Button>
          <Button variant="success">右</Button>
        </ButtonGroup>
      </DemoSection>

      <DemoSection code={outlineVariantsCode} title="轮廓样式">
        <ButtonGroup aria-label="轮廓样式按钮组">
          <Button variant="outline-primary">左</Button>
          <Button variant="outline-primary">中</Button>
          <Button variant="outline-primary">右</Button>
        </ButtonGroup>
      </DemoSection>

      <DemoSection code={checkboxCode} title="复选按钮组">
        <div className="d-flex flex-column gap-2">
          <ButtonGroup aria-label="复选按钮组">
            <input
              autoComplete="off"
              checked={checkboxValues.includes('1')}
              className="btn-check"
              id="btn-check-1"
              onChange={handleCheckboxChange}
              type="checkbox"
              value="1"
            />
            <label className="btn btn-outline-primary" htmlFor="btn-check-1">
              选项 1
            </label>
            <input
              autoComplete="off"
              checked={checkboxValues.includes('2')}
              className="btn-check"
              id="btn-check-2"
              onChange={handleCheckboxChange}
              type="checkbox"
              value="2"
            />
            <label className="btn btn-outline-primary" htmlFor="btn-check-2">
              选项 2
            </label>
            <input
              autoComplete="off"
              checked={checkboxValues.includes('3')}
              className="btn-check"
              id="btn-check-3"
              onChange={handleCheckboxChange}
              type="checkbox"
              value="3"
            />
            <label className="btn btn-outline-primary" htmlFor="btn-check-3">
              选项 3
            </label>
          </ButtonGroup>
          <span className="text-muted small">
            已选中：
            {checkboxValues.length > 0
              ? checkboxValues.map((value) => `选项 ${value}`).join('、')
              : '无'}
          </span>
        </div>
      </DemoSection>

      <DemoSection code={radioCode} title="单选按钮组">
        <div className="d-flex flex-column gap-2">
          <ButtonGroup aria-label="单选按钮组">
            <input
              autoComplete="off"
              checked={radioValue === '1'}
              className="btn-check"
              id="btn-radio-1"
              name="btn-radio"
              onChange={handleRadioChange}
              type="radio"
              value="1"
            />
            <label className="btn btn-outline-danger" htmlFor="btn-radio-1">
              单选 1
            </label>
            <input
              autoComplete="off"
              checked={radioValue === '2'}
              className="btn-check"
              id="btn-radio-2"
              name="btn-radio"
              onChange={handleRadioChange}
              type="radio"
              value="2"
            />
            <label className="btn btn-outline-danger" htmlFor="btn-radio-2">
              单选 2
            </label>
            <input
              autoComplete="off"
              checked={radioValue === '3'}
              className="btn-check"
              id="btn-radio-3"
              name="btn-radio"
              onChange={handleRadioChange}
              type="radio"
              value="3"
            />
            <label className="btn btn-outline-danger" htmlFor="btn-radio-3">
              单选 3
            </label>
          </ButtonGroup>
          <span className="text-muted small">已选中：单选 {radioValue}</span>
        </div>
      </DemoSection>

      <DemoSection code={toolbarCode} title="按钮工具栏">
        <ButtonToolbar aria-label="文本样式工具栏">
          <ButtonGroup aria-label="对齐方式组" className="me-2">
            <Button variant="outline-secondary">左对齐</Button>
            <Button variant="outline-secondary">居中</Button>
            <Button variant="outline-secondary">右对齐</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="文字样式组" className="me-2">
            <Button variant="outline-secondary">粗体</Button>
            <Button variant="outline-secondary">斜体</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="操作组">
            <Button variant="primary">保存</Button>
            <Button variant="danger">删除</Button>
          </ButtonGroup>
        </ButtonToolbar>
      </DemoSection>

      <DemoSection code={sizesCode} title="尺寸">
        <div className="d-flex flex-column align-items-start gap-2">
          <ButtonGroup aria-label="大尺寸按钮组" size="lg">
            <Button variant="outline-primary">左</Button>
            <Button variant="outline-primary">中</Button>
            <Button variant="outline-primary">右</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="默认尺寸按钮组">
            <Button variant="outline-primary">左</Button>
            <Button variant="outline-primary">中</Button>
            <Button variant="outline-primary">右</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="小尺寸按钮组" size="sm">
            <Button variant="outline-primary">左</Button>
            <Button variant="outline-primary">中</Button>
            <Button variant="outline-primary">右</Button>
          </ButtonGroup>
        </div>
        <p className="mb-0 mt-2 text-muted small">
          通过 size 属性统一设置整组按钮尺寸，无需为每个按钮单独指定
        </p>
      </DemoSection>

      <DemoSection code={verticalCode} title="垂直排列">
        <div className="d-flex flex-wrap align-items-start gap-4">
          <ButtonGroup aria-label="垂直按钮组" vertical>
            <Button variant="primary">按钮 1</Button>
            <Button variant="primary">按钮 2</Button>
            <Button variant="primary">按钮 3</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="垂直轮廓按钮组" vertical>
            <Button variant="outline-success">成功</Button>
            <Button variant="outline-warning">警告</Button>
            <Button variant="outline-danger">危险</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="垂直单选按钮组" vertical>
            <input
              autoComplete="off"
              checked={radioValue === '1'}
              className="btn-check"
              id="vbtn-radio-1"
              name="vbtn-radio"
              onChange={handleRadioChange}
              type="radio"
              value="1"
            />
            <label className="btn btn-outline-danger" htmlFor="vbtn-radio-1">
              单选 1
            </label>
            <input
              autoComplete="off"
              checked={radioValue === '2'}
              className="btn-check"
              id="vbtn-radio-2"
              name="vbtn-radio"
              onChange={handleRadioChange}
              type="radio"
              value="2"
            />
            <label className="btn btn-outline-danger" htmlFor="vbtn-radio-2">
              单选 2
            </label>
            <input
              autoComplete="off"
              checked={radioValue === '3'}
              className="btn-check"
              id="vbtn-radio-3"
              name="vbtn-radio"
              onChange={handleRadioChange}
              type="radio"
              value="3"
            />
            <label className="btn btn-outline-danger" htmlFor="vbtn-radio-3">
              单选 3
            </label>
          </ButtonGroup>
        </div>
      </DemoSection>

      <DemoSection code={combinedCode} title="组合使用">
        <ButtonToolbar aria-label="组合工具栏">
          <ButtonGroup aria-label="小尺寸轮廓组" className="me-2" size="sm">
            <Button variant="outline-info">复制</Button>
            <Button variant="outline-info">粘贴</Button>
            <Button variant="outline-info">剪切</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="垂直操作组" vertical>
            <Button variant="secondary">上移</Button>
            <Button variant="secondary">下移</Button>
          </ButtonGroup>
        </ButtonToolbar>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的按钮组组件，将一系列按钮组合为水平或垂直的视觉分组，并提供按钮工具栏以组合多个分组"
      componentName="ButtonGroup"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={buttonGroupProps}
      typeDefinitions={buttonGroupTypeDefinitions}
    />
  );
};

export default ButtonGroupDoc;
