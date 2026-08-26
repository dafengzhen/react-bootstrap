```tsx
const presets = [
  { alt: '图片头像', src: 'https://picsum.photos/seed/rbs-avatar-user/96/96' },
  { name: '张三' },
  { bg: 'info', children: '👋' },
];

<div className="d-flex align-items-center gap-3">
  <Avatar {...presets[mode]} />
  <Button onClick={handleNext} variant="outline-secondary">
    切换头像
  </Button>
</div>;
```
