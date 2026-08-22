```tsx
<form>
  <Row className="mb-3">
    <FormLabel column htmlFor="layoutHorizontalEmail" sm={2}>
      邮箱
    </FormLabel>
    <Col sm={10}>
      <FormControl id="layoutHorizontalEmail" type="email" />
    </Col>
  </Row>
  <Row className="mb-3">
    <FormLabel column htmlFor="layoutHorizontalPassword" sm={2}>
      密码
    </FormLabel>
    <Col sm={10}>
      <FormControl id="layoutHorizontalPassword" type="password" />
    </Col>
  </Row>
  <Row as="fieldset" className="mb-3">
    <FormLabel as="legend" column className="pt-0" sm={2}>
      单选按钮
    </FormLabel>
    <Col sm={10}>
      <FormCheck>
        <FormCheckInput
          defaultChecked
          id="layoutHorizontalRadio1"
          name="layoutHorizontalRadios"
          type="radio"
        />
        <FormCheckLabel htmlFor="layoutHorizontalRadio1">第一个单选</FormCheckLabel>
      </FormCheck>
      <FormCheck>
        <FormCheckInput id="layoutHorizontalRadio2" name="layoutHorizontalRadios" type="radio" />
        <FormCheckLabel htmlFor="layoutHorizontalRadio2">第二个单选</FormCheckLabel>
      </FormCheck>
      <FormCheck className="disabled">
        <FormCheckInput
          disabled
          id="layoutHorizontalRadio3"
          name="layoutHorizontalRadios"
          type="radio"
        />
        <FormCheckLabel htmlFor="layoutHorizontalRadio3">第三个禁用单选</FormCheckLabel>
      </FormCheck>
    </Col>
  </Row>
  <Row className="mb-3">
    <Col sm={{ offset: 2, span: 10 }}>
      <FormCheck>
        <FormCheckInput id="layoutHorizontalCheck" />
        <FormCheckLabel htmlFor="layoutHorizontalCheck">示例复选框</FormCheckLabel>
      </FormCheck>
    </Col>
  </Row>
  <Button type="submit" variant="primary">
    登录
  </Button>
</form>
```
