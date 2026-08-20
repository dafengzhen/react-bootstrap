```tsx
const [eventLog, setEventLog] = useState<string[]>([]);

const handleSlide = (index: number, direction: CarouselDirection) => {
  setEventLog((prev) => [`onSlide → 第 ${index + 1} 张（${direction}）`, ...prev].slice(0, 6));
};

const handleSlid = (index: number, direction: CarouselDirection) => {
  setEventLog((prev) => [`onSlid → 第 ${index + 1} 张（${direction}）`, ...prev].slice(0, 6));
};

<>
  {/* onSlide 在过渡开始时触发，onSlid 在过渡结束、索引更新后触发 */}
  <Carousel aria-label="过渡事件示例" onSlid={handleSlid} onSlide={handleSlide}>
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

  <ul className="list-group list-group-flush mt-3">
    {eventLog.map((entry, index) => (
      <li className="list-group-item" key={`${entry}-${index}`}>
        {entry}
      </li>
    ))}
  </ul>
</>;
```
