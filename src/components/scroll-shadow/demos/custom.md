```tsx
const [shadowSize, setShadowSize] = useState(16);
const [shadowColor, setShadowColor] = useState('#adb5bd');
const [disabled, setDisabled] = useState(false);

<>
  <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
    <label className="mb-0 small" htmlFor="scroll-shadow-size">
      尺寸 {shadowSize}px
    </label>
    <input
      className="form-range mb-0"
      id="scroll-shadow-size"
      max={32}
      min={4}
      onChange={(event) => setShadowSize(Number(event.target.value))}
      style={{ width: 140 }}
      type="range"
      value={shadowSize}
    />
    <input
      aria-label="阴影颜色"
      className="form-control form-control-color"
      onChange={(event) => setShadowColor(event.target.value)}
      title="选择阴影颜色"
      type="color"
      value={shadowColor}
    />
    <div className="form-check mb-0">
      <input
        checked={disabled}
        className="form-check-input"
        id="scroll-shadow-disabled"
        onChange={(event) => setDisabled(event.target.checked)}
        type="checkbox"
      />
      <label className="form-check-label" htmlFor="scroll-shadow-disabled">
        禁用阴影
      </label>
    </div>
  </div>
  <ScrollShadow
    className="border rounded-3"
    disabled={disabled}
    shadowColor={shadowColor}
    shadowSize={shadowSize}
    style={{ height: 220 }}
  >
    <div className="p-3">
      {Array.from({ length: 10 }, (_, index) => (
        <p className="mb-2" key={index}>
          第 {index + 1}{' '}
          段内容。调整尺寸与颜色后滚动容器，观察阴影层的变化；勾选“禁用阴影”可以完全关闭阴影。
        </p>
      ))}
    </div>
  </ScrollShadow>
</>;
```
