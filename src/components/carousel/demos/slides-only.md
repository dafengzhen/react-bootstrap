```tsx
const placeholderImage = (index: number) =>
  `https://picsum.photos/seed/rbs-carousel-${index}/1200/480`;

<Carousel aria-label="仅幻灯片示例" ride="carousel">
  <CarouselInner>
    {[0, 1, 2].map((index) => (
      <CarouselItem key={index}>
        <img alt={`占位图 ${index + 1}`} className="d-block w-100" src={placeholderImage(index)} />
      </CarouselItem>
    ))}
  </CarouselInner>
</Carousel>;
```
