```tsx
const [controlledIndex, setControlledIndex] = useState(0);

<>
  <div className="d-flex flex-wrap gap-2 mb-3">
    {SLIDES.map((slide, index) => (
      <Button
        key={slide.label}
        onClick={() => setControlledIndex(index)}
        variant={controlledIndex === index ? 'primary' : 'outline-primary'}
      >
        第 {index + 1} 张
      </Button>
    ))}
  </div>

  {/* 提供 activeIndex 即进入受控模式：组件只发出 onSelect 请求，索引由外部决定 */}
  <Carousel
    activeIndex={controlledIndex}
    aria-label="受控用法示例"
    onSelect={(index) => setControlledIndex(index)}
    wrap={false}
  >
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
  </Carousel>
</>;
```
