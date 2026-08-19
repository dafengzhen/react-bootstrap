```tsx
<div className="d-flex flex-wrap gap-2">
  <Button as="a" href="#" role="button" variant="primary">
    a 链接
  </Button>
  <Button href="#" role="button" variant="primary">
    href 自动渲染为 a
  </Button>
  <Button as="input" type="button" value="Input 按钮" variant="primary" />
  <Button as="input" type="submit" value="Submit 按钮" variant="primary" />
  <Button as="input" type="reset" value="Reset 按钮" variant="primary" />
</div>
```
