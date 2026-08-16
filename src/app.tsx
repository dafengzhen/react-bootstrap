import ButtonGroupDoc from './components/button-group/button-group.doc';
import ButtonDoc from './components/button/button.doc';
import { type DocConfig, DocsHome } from './components/docs';

const docsConfig: DocConfig[] = [
  {
    component: <ButtonDoc />,
    description: '通用按钮组件，支持多种变体、尺寸和状态',
    icon: '🔘',
    name: 'Button',
    order: 1,
    tags: ['基础', '表单'],
  },
  {
    component: <ButtonGroupDoc />,
    description: '按钮组组件，将多个按钮组合为一个整体，支持水平/垂直排列与统一尺寸',
    icon: '🔗',
    name: 'ButtonGroup',
    order: 2,
    tags: ['基础', '布局'],
  },
];

function App() {
  return (
    <DocsHome
      description="欢迎使用组件库，以下是所有组件的文档和使用指南"
      docs={docsConfig}
      title="组件库文档"
    />
  );
}

export default App;
