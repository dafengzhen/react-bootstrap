```tsx
const { ref, visibility } = useScrollShadow<HTMLDivElement>({ direction: 'horizontal' });

const gradient = (side: 'left' | 'right') =>
  `linear-gradient(to ${side}, rgba(13, 110, 253, 0.35), transparent)`;

<div className="position-relative">
  <div
    className="border rounded-3"
    ref={ref}
    style={{ height: 88, overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}
  >
    {Array.from({ length: 14 }, (_, index) => (
      <span
        className="badge bg-light text-dark border d-inline-flex align-items-center m-2"
        key={index}
      >
        标签 #{index + 1}
      </span>
    ))}
  </div>
  {visibility.left && (
    <div
      aria-hidden="true"
      className="position-absolute bottom-0 start-0 top-0"
      style={{ background: gradient('left'), pointerEvents: 'none', width: 32 }}
    />
  )}
  {visibility.right && (
    <div
      aria-hidden="true"
      className="position-absolute bottom-0 end-0 top-0"
      style={{ background: gradient('right'), pointerEvents: 'none', width: 32 }}
    />
  )}
</div>;
```
