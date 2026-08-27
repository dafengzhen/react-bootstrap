```tsx
const [fontColor, setFontColor] = useState('#adb5bd');
const [fontSize, setFontSize] = useState(16);
const [gapValue, setGapValue] = useState(100);
const [opacity, setOpacity] = useState(30);
const [rotate, setRotate] = useState(-22);

<>
  <div className="d-flex flex-wrap gap-3 mb-3 align-items-center">
    <label className="mb-0 small" htmlFor="watermark-rotate">
      角度 {rotate}°
    </label>
    <input
      className="form-range mb-0"
      id="watermark-rotate"
      max={90}
      min={-90}
      onChange={(event) => setRotate(Number(event.target.value))}
      style={{ width: 140 }}
      type="range"
      value={rotate}
    />
    <label className="mb-0 small" htmlFor="watermark-gap">
      间距 {gapValue}px
    </label>
    <input
      className="form-range mb-0"
      id="watermark-gap"
      max={200}
      min={0}
      onChange={(event) => setGapValue(Number(event.target.value))}
      style={{ width: 140 }}
      type="range"
      value={gapValue}
    />
    <label className="mb-0 small" htmlFor="watermark-opacity">
      透明度 {opacity}%
    </label>
    <input
      className="form-range mb-0"
      id="watermark-opacity"
      max={100}
      min={0}
      onChange={(event) => setOpacity(Number(event.target.value))}
      style={{ width: 140 }}
      type="range"
      value={opacity}
    />
    <label className="mb-0 small" htmlFor="watermark-font-size">
      字号 {fontSize}px
    </label>
    <input
      className="form-range mb-0"
      id="watermark-font-size"
      max={32}
      min={10}
      onChange={(event) => setFontSize(Number(event.target.value))}
      style={{ width: 140 }}
      type="range"
      value={fontSize}
    />
    <input
      aria-label="水印颜色"
      className="form-control form-control-color"
      onChange={(event) => setFontColor(event.target.value)}
      title="选择水印颜色"
      type="color"
      value={fontColor}
    />
  </div>
  <Watermark
    content="React Bootstrap"
    font={{ color: fontColor, fontSize }}
    gap={[gapValue, gapValue]}
    opacity={opacity / 100}
    rotate={rotate}
  >
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">可调参数水印</h5>
        <p className="card-text mb-0">
          拖动上方滑块实时调整旋转角度、平铺间距、透明度、字号与颜色，所有变化都会立即重新生成水印图案。
        </p>
      </div>
    </div>
  </Watermark>
</>;
```
