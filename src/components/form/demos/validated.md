```tsx
const handleSubmit = (event) => {
  event.preventDefault();
};

<Form noValidate validated onSubmit={handleSubmit}>
  <FormGroup className="mb-3" controlId="validationEmail">
    <FormLabel>邮箱</FormLabel>
    <FormControl placeholder="name@example.com" required type="email" />
    <FormFeedback>请输入有效的邮箱地址。</FormFeedback>
  </FormGroup>

  <FormGroup className="mb-3" controlId="validationPassword">
    <FormLabel>密码</FormLabel>
    <FormControl minLength={8} placeholder="至少 8 个字符" required type="password" />
    <FormFeedback>密码至少需要 8 个字符。</FormFeedback>
  </FormGroup>

  <FormGroup className="mb-3" controlId="validationAgreement">
    <FormCheck>
      <FormCheckInput required type="checkbox" />
      <FormCheckLabel>我已阅读并同意条款</FormCheckLabel>
      <FormFeedback>请先勾选同意条款。</FormFeedback>
    </FormCheck>
  </FormGroup>

  <Button type="submit" variant="primary">
    注册
  </Button>
</Form>;
```
