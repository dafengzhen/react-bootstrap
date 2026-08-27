```tsx
<Form>
  <FormGroup as={Row} className="mb-3" controlId="gridEmail">
    <FormLabel column sm={2}>
      邮箱
    </FormLabel>
    <Col sm={10}>
      <FormControl placeholder="name@example.com" type="email" />
    </Col>
  </FormGroup>

  <FormGroup as={Row} className="mb-3" controlId="gridPassword">
    <FormLabel column sm={2}>
      密码
    </FormLabel>
    <Col sm={10}>
      <FormControl placeholder="请输入密码" type="password" />
    </Col>
  </FormGroup>

  <FormGroup as={Row} className="mb-3" controlId="gridCheckbox">
    <Col sm={{ offset: 2, span: 10 }}>
      <FormCheck>
        <FormCheckInput type="checkbox" />
        <FormCheckLabel>记住我</FormCheckLabel>
      </FormCheck>
    </Col>
  </FormGroup>

  <Button type="submit" variant="primary">
    登录
  </Button>
</Form>
```
