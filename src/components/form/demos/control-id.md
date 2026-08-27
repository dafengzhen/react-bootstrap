```tsx
<Form>
  <FormGroup className="mb-3" controlId="autoEmail">
    <FormLabel>邮箱</FormLabel>
    <FormControl placeholder="name@example.com" type="email" />
    <FormText muted>点击标签即可聚焦输入框，无需手动设置 id 与 htmlFor。</FormText>
  </FormGroup>

  <FormGroup controlId="autoAgreement">
    <FormCheck>
      <FormCheckInput type="checkbox" />
      <FormCheckLabel>同意服务条款</FormCheckLabel>
    </FormCheck>
  </FormGroup>
</Form>
```
