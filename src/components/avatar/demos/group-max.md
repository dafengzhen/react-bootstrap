```tsx
const members = [1, 2, 3, 4, 5, 6].map(
  (index) => `https://picsum.photos/seed/rbs-avatar-${index}/96/96`,
);

<AvatarGroup max={4}>
  {members.map((src, index) => (
    <Avatar alt={`成员 ${index + 1}`} key={index} src={src} />
  ))}
</AvatarGroup>;
```
