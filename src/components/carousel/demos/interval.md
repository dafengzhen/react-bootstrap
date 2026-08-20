```tsx
// CarouselItem 的 interval 优先于 Carousel 的 interval，仅在该幻灯片为当前项时生效
<Carousel aria-label="单独设置切换间隔示例" interval={3000} ride="carousel">
  <CarouselIndicators />
  <CarouselInner>
    <CarouselItem interval={1000}>
      <ColorSlide color={SLIDES[0].color} label="停留 1 秒" />
    </CarouselItem>
    <CarouselItem interval={4000}>
      <ColorSlide color={SLIDES[1].color} label="停留 4 秒" />
    </CarouselItem>
    <CarouselItem>
      <ColorSlide color={SLIDES[2].color} label="停留 3 秒（默认间隔）" />
    </CarouselItem>
  </CarouselInner>
</Carousel>
```
