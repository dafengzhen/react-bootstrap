```tsx
<Carousel aria-label="带标题示例">
  <CarouselIndicators />
  <CarouselInner>
    {[0, 1, 2].map((index) => (
      <CarouselItem key={index}>
        <img
          alt={`占位图 ${index + 1}`}
          className="d-block w-100"
          src={placeholderImage(index + 10)}
        />
        <CarouselCaption className="d-md-block d-none">
          <h5>第 {index + 1} 张标题</h5>
          <p>标题与描述文本会覆盖在幻灯片上，可在小屏通过工具类隐藏。</p>
        </CarouselCaption>
      </CarouselItem>
    ))}
  </CarouselInner>
  <CarouselControl direction="prev" label="上一张" />
  <CarouselControl direction="next" label="下一张" />
</Carousel>
```
