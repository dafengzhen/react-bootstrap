```tsx
<Form>
  <fieldset disabled>
    <FormGroup className="mb-3" controlId="disabledTextInput">
      <FormLabel>禁用输入</FormLabel>
      <FormControl placeholder="禁用的输入框" type="text" />
    </FormGroup>

    <FormGroup className="mb-3" controlId="disabledSelect">
      <FormLabel>禁用选择</FormLabel>
      <FormSelect aria-label="禁用的下拉选择">
        <option>禁用的选项</option>
      </FormSelect>
    </FormGroup>

    <FormGroup controlId="disabledCheck">
      <FormCheck>
        <FormCheckInput type="checkbox" />
        <FormCheckLabel>无法勾选</FormCheckLabel>
      </FormCheck>
    </FormGroup>

    <Button className="mt-3" type="submit" variant="primary">
      提交
    </Button>
  </fieldset>
</Form>
```
