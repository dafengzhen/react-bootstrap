```tsx
<FormCheck>
  <FormCheckInput id="validCheck" isValid />
  <FormCheckLabel htmlFor="validCheck">有效的复选框</FormCheckLabel>
  <FormFeedback type="valid">看起来不错！</FormFeedback>
</FormCheck>

<FormCheck>
  <FormCheckInput id="invalidCheck" isInvalid />
  <FormCheckLabel htmlFor="invalidCheck">无效的复选框</FormCheckLabel>
  <FormFeedback type="invalid">必须勾选此复选框。</FormFeedback>
</FormCheck>
```
