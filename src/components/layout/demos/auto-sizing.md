```tsx
<Row as="form" className="align-items-center gx-3 gy-2">
  <Col xs="auto">
    <FormLabel visuallyHidden htmlFor="layoutAutoInput">
      姓名
    </FormLabel>
    <FormControl id="layoutAutoInput" placeholder="张三" />
  </Col>
  <Col xs="auto">
    <FormLabel visuallyHidden htmlFor="layoutAutoInputGroup">
      用户名
    </FormLabel>
    <InputGroup>
      <InputGroupText>@</InputGroupText>
      <FormControl id="layoutAutoInputGroup" placeholder="用户名" />
    </InputGroup>
  </Col>
  <Col xs="auto">
    <FormLabel visuallyHidden htmlFor="layoutAutoSelect">
      偏好
    </FormLabel>
    <FormSelect id="layoutAutoSelect">
      <option selected>请选择...</option>
      <option value="1">选项 1</option>
      <option value="2">选项 2</option>
      <option value="3">选项 3</option>
    </FormSelect>
  </Col>
  <Col xs="auto">
    <FormCheck>
      <FormCheckInput id="layoutAutoCheck" />
      <FormCheckLabel htmlFor="layoutAutoCheck">记住我</FormCheckLabel>
    </FormCheck>
  </Col>
  <Col xs="auto">
    <Button type="submit" variant="primary">
      提交
    </Button>
  </Col>
</Row>
```
