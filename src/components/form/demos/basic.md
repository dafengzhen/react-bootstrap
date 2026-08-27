```tsx
<Form>
  <FormGroup className="mb-3" controlId="formBasicEmail">
    <FormLabel>邮箱地址</FormLabel>
    <FormControl placeholder="name@example.com" type="email" />
    <FormText muted>我们不会将您的邮箱分享给任何人。</FormText>
  </FormGroup>

  <FormGroup className="mb-3" controlId="formBasicPassword">
    <FormLabel>密码</FormLabel>
    <FormControl placeholder="请输入密码" type="password" />
  </FormGroup>

  <FormGroup className="mb-3" controlId="formBasicCheckbox">
    <FormCheck>
      <FormCheckInput type="checkbox" />
      <FormCheckLabel>记住我</FormCheckLabel>
    </FormCheck>
  </FormGroup>

  <Button type="submit" variant="primary">
    提交
  </Button>
</Form>
```
