```tsx
// CarouselIndicators 未提供 children 时，会按幻灯片数量自动生成指示器
<Carousel aria-label="带指示器示例">
  <CarouselIndicators labels={['第一张', '第二张', '第三张']} />
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

// 也可以自行渲染，完全控制每个指示器
<CarouselIndicators>
  <CarouselIndicator aria-label="第一张" index={0} />
  <CarouselIndicator aria-label="第二张" index={1} />
  <CarouselIndicator aria-label="第三张" index={2} />
</CarouselIndicators>;
```
