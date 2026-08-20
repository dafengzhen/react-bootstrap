```tsx
<style>{`.custom-popover { --bs-popover-max-width: 280px; --bs-popover-bg: var(--bs-dark); --bs-popover-header-bg: var(--bs-dark); --bs-popover-header-color: var(--bs-white); --bs-popover-body-color: var(--bs-white); --bs-popover-border-color: var(--bs-dark); }`}</style>
<PopoverTrigger
  content="使用 CSS 变量定制的深色弹窗"
  customClass="custom-popover"
  title="自定义样式"
>
  <Button variant="secondary">自定义样式</Button>
</PopoverTrigger>
```
