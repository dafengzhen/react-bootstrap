```tsx
const members = [1, 2, 3].map((index) => `https://picsum.photos/seed/rbs-avatar-${index}/96/96`);

<AvatarGroup>
  <Avatar alt="成员 1" src={members[0]} />
  <Avatar alt="成员 2" src={members[1]} />
  <Avatar alt="成员 3" src={members[2]} />
</AvatarGroup>;
```
