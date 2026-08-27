```tsx
const handleSubmit = (event) => {
  event.preventDefault();
  setSubmitted(true);
};

<Form onSubmit={handleSubmit}>
  <FormGroup className="mb-3" controlId="loginEmail">
    <FormLabel>邮箱</FormLabel>
    <FormControl
      onChange={handleEmailChange}
      placeholder="name@example.com"
      required
      type="email"
      value={email}
    />
  </FormGroup>

  <FormGroup className="mb-3" controlId="loginPassword">
    <FormLabel>密码</FormLabel>
    <FormControl
      onChange={handlePasswordChange}
      placeholder="请输入密码"
      required
      type="password"
      value={password}
    />
  </FormGroup>

  <Button type="submit" variant="primary">
    登录
  </Button>

  {submitted && (
    <Alert className="mt-3" variant="success">
      登录成功，邮箱：{email}
    </Alert>
  )}
</Form>;
```
