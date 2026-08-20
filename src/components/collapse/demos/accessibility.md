```tsx
<>
  <Button
    aria-controls="collapse-a11y"
    aria-expanded={a11yOpen}
    onClick={() => setA11yOpen((prev) => !prev)}
    variant="primary"
  >
    展开更多信息
  </Button>

  <Collapse id="collapse-a11y" in={a11yOpen}>
    <div className="card card-body mt-3">
      触发器通过 aria-expanded 与 aria-controls 关联折叠区域，折叠区域通过 id
      与触发器对应，屏幕阅读器可以借助这些属性定位折叠区域。
    </div>
  </Collapse>
</>
```
