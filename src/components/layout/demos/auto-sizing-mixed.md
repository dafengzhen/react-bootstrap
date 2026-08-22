```tsx
<Row as="form" className="align-items-center gx-3 gy-2">
  <Col sm={3}>
    <FormLabel visuallyHidden htmlFor="layoutMixedName">
      姓名
    </FormLabel>
    <FormControl id="layoutMixedName" placeholder="张三" />
  </Col>
  <Col sm={3}>
    <FormLabel visuallyHidden htmlFor="layoutMixedUsername">
      用户名
    </FormLabel>
    <InputGroup>
      <InputGroupText>@</InputGroupText>
      <FormControl id="layoutMixedUsername" placeholder="用户名" />
    </InputGroup>
  </Col>
  <Col sm={3}>
    <FormLabel visuallyHidden htmlFor="layoutMixedSelect">
      偏好
    </FormLabel>
    <FormSelect id="layoutMixedSelect">
      <option selected>请选择...</option>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
  </Col>
  <Col xs="auto">
    <FormCheck>
      <FormCheckInput id="layoutMixedCheck" />
      <FormCheckLabel htmlFor="layoutMixedCheck">记住我</FormCheckLabel>
    </FormCheck>
  </Col>
  <Col xs="auto">
    <Button type="submit" variant="primary">
      提交
    </Button>
  </Col>
</Row>
```
