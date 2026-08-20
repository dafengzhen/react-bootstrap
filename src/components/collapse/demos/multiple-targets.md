```tsx
<>
  <Button
    aria-controls="collapse-target-a collapse-target-b"
    aria-expanded={multipleOpen}
    onClick={() => setMultipleOpen((prev) => !prev)}
    variant="primary"
  >
    同时切换两个折叠区域
  </Button>

  <div className="row mt-3">
    <div className="col">
      <Collapse id="collapse-target-a" in={multipleOpen}>
        <div className="card card-body">第一个折叠区域的内容</div>
      </Collapse>
    </div>
    <div className="col">
      <Collapse id="collapse-target-b" in={multipleOpen}>
        <div className="card card-body">第二个折叠区域的内容</div>
      </Collapse>
    </div>
  </div>
</>
```
