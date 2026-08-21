```tsx
<>
  <Button onClick={() => setFormOpen(true)} variant="primary">
    新建项目
  </Button>

  <Offcanvas isOpen={formOpen} onOpenChange={setFormOpen}>
    <OffcanvasHeader closeButton>
      <OffcanvasTitle>新建项目</OffcanvasTitle>
    </OffcanvasHeader>
    <OffcanvasBody>
      <form>
        <div className="mb-3">
          <label className="form-label" htmlFor="offcanvas-form-name">
            项目名称
          </label>
          <input className="form-control" id="offcanvas-form-name" placeholder="输入项目名称" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="offcanvas-form-desc">
            项目描述
          </label>
          <textarea
            className="form-control"
            id="offcanvas-form-desc"
            placeholder="输入项目描述"
            rows={3}
          />
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button onClick={() => setFormOpen(false)} variant="secondary">
            取消
          </Button>
          <Button onClick={() => setFormOpen(false)} variant="primary">
            创建
          </Button>
        </div>
      </form>
    </OffcanvasBody>
  </Offcanvas>
</>
```
