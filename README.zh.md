# React Bootstrap

基于 Bootstrap 5 的 React 组件库

[![GitHub License](https://img.shields.io/github/license/dafengzhen/react-bootstrap?color=blue)](https://github.com/dafengzhen/react-bootstrap)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/react-bootstrap/pulls)

[English](./README.md)

## 特性

- 基于 Bootstrap 5，支持全部内置变体与尺寸
- ES Module 输出，支持 Tree Shaking
- 完整的 TypeScript 类型支持
- React 19 + React Compiler

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

## 许可证

[MIT](./LICENSE)
