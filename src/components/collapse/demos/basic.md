```tsx
<>
  <Button
    aria-controls="collapse-basic"
    aria-expanded={basicOpen}
    onClick={() => setBasicOpen((prev) => !prev)}
    variant="primary"
  >
    切换折叠内容
  </Button>

  <Collapse id="collapse-basic" in={basicOpen}>
    <div className="card card-body mt-3">
      Some placeholder content for the collapse component. This panel is hidden by default but
      revealed when the user activates the relevant trigger.
    </div>
  </Collapse>
</>
```
