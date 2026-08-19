```tsx
<Button className="me-2" disabled={loading} onClick={handleToggle} variant="primary">
  {loading && (
    <Spinner animation="border" aria-hidden="true" as="span" className="me-2" size="sm" />
  )}
  {loading ? '提交中...' : '提交'}
</Button>
<Button disabled={loading} onClick={handleReset} variant="outline-secondary">
  重置
</Button>
```
