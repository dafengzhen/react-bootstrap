```tsx
<div>
  <InputGroup className="mb-3">
    <InputGroupText id="basic-addon1">@</InputGroupText>
    <FormControl
      aria-describedby="basic-addon1"
      aria-label="用户名"
      placeholder="用户名"
      type="text"
    />
  </InputGroup>

  <InputGroup className="mb-3">
    <FormControl aria-describedby="basic-addon2" aria-label="金额" placeholder="金额" type="text" />
    <InputGroupText id="basic-addon2">.00</InputGroupText>
  </InputGroup>

  <InputGroup className="mb-3">
    <InputGroupText>$</InputGroupText>
    <FormControl aria-label="金额（美元）" type="text" />
    <InputGroupText>.00</InputGroupText>
  </InputGroup>
</div>
```
