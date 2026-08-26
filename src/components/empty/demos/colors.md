```tsx
const bgColors = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
] as const;

<div className="d-flex flex-wrap gap-3 justify-content-around">
  {bgColors.map((bg) => (
    <EmptyImage bg={bg} height={80} key={bg} label={bg} width={120} />
  ))}
</div>;
```
