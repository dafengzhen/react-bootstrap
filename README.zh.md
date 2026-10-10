# React Bootstrap

基于 Bootstrap 5 的 React 组件库

[![GitHub License](https://img.shields.io/github/license/dafengzhen/react-bootstrap?color=blue)](https://github.com/dafengzhen/react-bootstrap)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/react-bootstrap/pulls)

[English](./README.md)

## 特性

- 基于 Bootstrap 5，支持全部内置变体与尺寸
- ES Module 输出，支持 Tree Shaking
- 完整的 TypeScript 类型支持
- React 19
- Vitest 浏览器模式组件测试 + Playwright 端到端测试

## 安装

```bash
npm install @dafengzhen/react-bootstrap bootstrap react react-dom clsx
```

## 快速开始

```tsx
import { Button } from '@dafengzhen/react-bootstrap';
import '@dafengzhen/react-bootstrap/button/style';

function App() {
  return (
    <>
      <Button variant="primary">主要按钮</Button>
      <Button variant="outline-success" size="lg">
        大型轮廓按钮
      </Button>
      <Button loading loadingText="提交中...">
        提交
      </Button>
    </>
  );
}
```

## 组件

| 组件                              | 说明                                   |
| --------------------------------- | -------------------------------------- |
| [Button](./src/components/button) | 通用按钮组件，支持多种变体、尺寸和状态 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动文档站点
npm run dev

# 构建组件库
npm run build

# 代码检查与格式化
npm run lint:fmt
```

## 测试

单元测试（Node 环境，`*.node.test.ts`）与组件测试（Vitest 浏览器模式 + Playwright，`*.browser.test.tsx`）：

```bash
# 一次性运行全部 Vitest 测试（unit + browser 两个 project）
npm test

# 只运行单个 project
npm run test:unit
npm run test:browser

# 覆盖率报告（输出到 ./coverage）
npm run test:coverage
```

端到端测试使用 Playwright，覆盖文档站点的真实交互（`e2e/**/*.spec.ts`）：

```bash
# 首次运行前安装浏览器（仅 chromium）
npm run test:e2e:install

# 运行 E2E，会自动启动文档站点开发服务器
npm run test:e2e
```

## 许可证

[MIT](./LICENSE)
