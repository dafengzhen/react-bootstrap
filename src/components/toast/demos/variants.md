```tsx
<div className="d-flex flex-wrap gap-3 mt-3">
  {(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const).map(
    (variant) => (
      <Toast autohide={false} key={variant} variant={variant}>
        <div className="d-flex">
          <ToastBody>Hello, world! This is a toast message.</ToastBody>
          <ToastClose className="m-auto me-2" />
        </div>
      </Toast>
    ),
  )}
</div>
```
