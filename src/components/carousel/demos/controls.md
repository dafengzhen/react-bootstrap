```tsx
// 纯色 div 作为图片占位，也可以直接换成 <img />
const SLIDES = [
  { color: '#0d6efd', label: '第一张幻灯片' },
  { color: '#6c757d', label: '第二张幻灯片' },
  { color: '#198754', label: '第三张幻灯片' },
];

const ColorSlide = ({ color, label }: { color: string; label: string }) => (
  <div
    className="align-items-center d-flex justify-content-center text-white"
    style={{ backgroundColor: color, height: 260 }}
  >
    <span className="fs-4 fw-semibold">{label}</span>
  </div>
);

<Carousel aria-label="带控制按钮示例">
  <CarouselInner>
    {SLIDES.map((slide) => (
      <CarouselItem key={slide.label}>
        <ColorSlide color={slide.color} label={slide.label} />
      </CarouselItem>
    ))}
  </CarouselInner>
  <CarouselControl direction="prev" label="上一张" />
  <CarouselControl direction="next" label="下一张" />
</Carousel>;
```
