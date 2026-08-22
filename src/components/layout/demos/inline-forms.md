```tsx
<Row as="form" className="align-items-center g-3" lg="auto">
  <Col xs={12}>
    <FormLabel visuallyHidden htmlFor="layoutInlineUsername">
      用户名
    </FormLabel>
    <InputGroup>
      <InputGroupText>@</InputGroupText>
      <FormControl id="layoutInlineUsername" placeholder="用户名" />
    </InputGroup>
  </Col>
  <Col xs={12}>
    <FormLabel visuallyHidden htmlFor="layoutInlineSelect">
      偏好
    </FormLabel>
    <FormSelect id="layoutInlineSelect">
      <option selected>请选择...</option>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
  </Col>
  <Col xs={12}>
    <FormCheck>
      <FormCheckInput id="layoutInlineCheck" />
      <FormCheckLabel htmlFor="layoutInlineCheck">记住我</FormCheckLabel>
    </FormCheck>
  </Col>
  <Col xs={12}>
    <Button type="submit" variant="primary">
      提交
    </Button>
  </Col>
</Row>
```
