```tsx
<>
  <div className="d-flex gap-2">
    <Button
      aria-controls="collapse-fast"
      aria-expanded={fastOpen}
      onClick={() => setFastOpen((prev) => !prev)}
      size="sm"
      variant="outline-primary"
    >
      快速折叠（150ms）
    </Button>
    <Button
      aria-controls="collapse-slow"
      aria-expanded={slowOpen}
      onClick={() => setSlowOpen((prev) => !prev)}
      size="sm"
      variant="outline-primary"
    >
      慢速折叠（900ms）
    </Button>
  </div>

  <Collapse duration={150} id="collapse-fast" in={fastOpen}>
    <div className="card card-body mt-3">duration 为 150 毫秒，过渡更快。</div>
  </Collapse>
  <Collapse duration={900} id="collapse-slow" in={slowOpen}>
    <div className="card card-body mt-3">duration 为 900 毫秒，过渡更慢。</div>
  </Collapse>
</>
```
