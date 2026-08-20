```tsx
<>
  <Button
    aria-controls="collapse-horizontal"
    aria-expanded={horizontalOpen}
    onClick={() => setHorizontalOpen((prev) => !prev)}
    variant="primary"
  >
    切换宽度折叠
  </Button>

  <div className="mt-3" style={{ minHeight: 120 }}>
    <Collapse dimension="width" id="collapse-horizontal" in={horizontalOpen}>
      <div className="card card-body" style={{ width: 300 }}>
        This is some placeholder content for a horizontal collapse. It's hidden by default and shown
        when triggered.
      </div>
    </Collapse>
  </div>
</>
```
