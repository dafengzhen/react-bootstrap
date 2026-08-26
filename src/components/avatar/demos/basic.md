```tsx
const avatars = [1, 2, 3, 4].map((index) => `https://picsum.photos/seed/rbs-avatar-${index}/96/96`);

<div className="d-flex flex-wrap gap-3 align-items-center">
  {avatars.map((src, index) => (
    <Avatar alt={`用户头像 ${index + 1}`} key={index} src={src} />
  ))}
</div>;
```
