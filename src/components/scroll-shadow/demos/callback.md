```tsx
const [visibility, setVisibility] = useState<ScrollShadowVisibility | null>(null);

<>
  <ScrollShadow
    className="border rounded-3 bg-body"
    onChange={setVisibility}
    style={{ height: 200 }}
  >
    <div className="p-3">
      {Array.from({ length: 10 }, (_, index) => (
        <p className="mb-2" key={index}>
          第 {index + 1} 段内容，滚动容器并观察下方四边可见性徽章的变化。
        </p>
      ))}
    </div>
  </ScrollShadow>
  <div className="d-flex flex-wrap gap-2 mt-3">
    {(['top', 'bottom', 'left', 'right'] as const).map((edge) => (
      <span className={`badge text-bg-${visibility?.[edge] ? 'primary' : 'secondary'}`} key={edge}>
        {edge}: {String(visibility?.[edge] ?? false)}
      </span>
    ))}
  </div>
</>;
```
