```tsx
// 通过 useCarousel() 读取自动播放状态并手动暂停 / 播放
const AutoPlayToggle = () => {
  const { autoPlaying, pause, paused, play } = useCarousel();

  return (
    <div className="bottom-0 end-0 m-2 position-absolute" style={{ zIndex: 3 }}>
      {autoPlaying && paused ? <span className="badge bg-dark me-2">悬停暂停中</span> : null}
      <Button onClick={autoPlaying ? pause : play} size="sm" variant="light">
        {autoPlaying ? '暂停自动播放' : '开始自动播放'}
      </Button>
    </div>
  );
};

// ride="carousel"：挂载后立即播放；悬停或键盘聚焦时暂停，页面切到后台也会暂停
<Carousel aria-label="立即自动播放示例" interval={2000} ride="carousel">
  <CarouselIndicators />
  <CarouselInner>
    {SLIDES.map((slide) => (
      <CarouselItem key={slide.label}>
        <ColorSlide color={slide.color} label={slide.label} />
      </CarouselItem>
    ))}
  </CarouselInner>
  <AutoPlayToggle />
</Carousel>;

// ride：首次手动切换（点击、键盘、滑动）之后才开始自动播放
<Carousel aria-label="交互后自动播放示例" interval={2000} ride>
  <CarouselIndicators />
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
