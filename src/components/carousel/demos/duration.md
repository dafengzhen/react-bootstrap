```tsx
// duration 会写入 --rbs-carousel-duration，其余 --rbs-carousel-* 变量可通过 style 覆盖
<Carousel
  aria-label="自定义过渡时长示例"
  duration={1200}
  style={{ '--rbs-carousel-easing': 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
>
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

// slide={false} 完全关闭过渡；系统开启 prefers-reduced-motion: reduce 时同样直接切换
<Carousel aria-label="无过渡示例" slide={false}>
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
