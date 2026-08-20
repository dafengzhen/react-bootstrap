```tsx
// Bootstrap 5.3 推荐使用 data-bs-theme="dark" 代替已废弃的 .carousel-dark
<Carousel aria-label="深色变体示例" data-bs-theme="dark">
  <CarouselIndicators />
  <CarouselInner>
    {LIGHT_SLIDES.map((slide) => (
      <CarouselItem key={slide.label}>
        <ColorSlide color={slide.color} dark label={slide.label} />
      </CarouselItem>
    ))}
  </CarouselInner>
  <CarouselControl direction="prev" label="上一张" />
  <CarouselControl direction="next" label="下一张" />
</Carousel>
```
