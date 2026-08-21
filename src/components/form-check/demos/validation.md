```tsx
<FormCheck>
  <FormCheckInput id="validCheck" isValid />
  <FormCheckLabel htmlFor="validCheck">有效的复选框</FormCheckLabel>
  <div className="valid-feedback">看起来不错！</div>
</FormCheck>

<FormCheck>
  <FormCheckInput id="invalidCheck" isInvalid />
  <FormCheckLabel htmlFor="invalidCheck">无效的复选框</FormCheckLabel>
  <div className="invalid-feedback">必须勾选此复选框。</div>
</FormCheck>
```
