```tsx
// fade 使用自定义的交叉淡入淡出过渡（不依赖 Bootstrap 的 carousel-fade 类）
<Carousel aria-label="交叉淡入淡出示例" fade>
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
