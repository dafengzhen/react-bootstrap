```tsx
// touch={false} 关闭触摸 / 触控笔滑动，仅保留控制按钮与键盘方向键
<Carousel aria-label="禁用触摸滑动示例" touch={false}>
  <CarouselInner>
    {SLIDES.map((slide) => (
      <CarouselItem key={slide.label}>
        <ColorSlide color={slide.color} label={slide.label} />
      </CarouselItem>
    ))}
  </CarouselInner>
  <CarouselControl direction="prev" label="上一张" />
  <CarouselControl direction="next" label="下一张" />
</Carousel>
```
