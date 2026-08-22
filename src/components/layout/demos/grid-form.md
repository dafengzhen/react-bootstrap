```tsx
<Row as="form" className="g-3">
  <Col md={6}>
    <FormLabel htmlFor="layoutGridEmail">邮箱</FormLabel>
    <FormControl id="layoutGridEmail" type="email" />
  </Col>
  <Col md={6}>
    <FormLabel htmlFor="layoutGridPassword">密码</FormLabel>
    <FormControl id="layoutGridPassword" type="password" />
  </Col>
  <Col xs={12}>
    <FormLabel htmlFor="layoutGridAddress">地址</FormLabel>
    <FormControl id="layoutGridAddress" placeholder="1234 主街" />
  </Col>
  <Col xs={12}>
    <FormLabel htmlFor="layoutGridAddress2">地址 2</FormLabel>
    <FormControl id="layoutGridAddress2" placeholder="公寓、工作室或楼层" />
  </Col>
  <Col md={6}>
    <FormLabel htmlFor="layoutGridCity">城市</FormLabel>
    <FormControl id="layoutGridCity" />
  </Col>
  <Col md={4}>
    <FormLabel htmlFor="layoutGridState">省份</FormLabel>
    <FormSelect id="layoutGridState">
      <option selected>请选择...</option>
      <option>...</option>
    </FormSelect>
  </Col>
  <Col md={2}>
    <FormLabel htmlFor="layoutGridZip">邮编</FormLabel>
    <FormControl id="layoutGridZip" />
  </Col>
  <Col xs={12}>
    <FormCheck>
      <FormCheckInput id="layoutGridCheck" />
      <FormCheckLabel htmlFor="layoutGridCheck">勾选我</FormCheckLabel>
    </FormCheck>
  </Col>
  <Col xs={12}>
    <Button type="submit" variant="primary">
      登录
    </Button>
  </Col>
</Row>
```
