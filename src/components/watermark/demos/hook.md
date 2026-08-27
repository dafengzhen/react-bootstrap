```tsx
const { dataUrl, height, width } = useWatermark({
  content: 'useWatermark 自定义组合',
  gap: [60, 60],
  opacity: 0.5,
  rotate: -25,
});

<div
  className="border rounded-3 p-4"
  style={{
    backgroundImage: dataUrl ? `url('${dataUrl}')` : undefined,
    backgroundRepeat: 'repeat',
    backgroundSize: `${width}px ${height}px`,
  }}
>
  <h5 className="mb-2">任意容器上的水印</h5>
  <p className="mb-0 text-muted">
    useWatermark 返回生成的 dataUrl 与平铺块尺寸，可挂到任意元素的背景上自行组合；Watermark
    组件本身即基于该 Hook 实现。
  </p>
</div>;
```
