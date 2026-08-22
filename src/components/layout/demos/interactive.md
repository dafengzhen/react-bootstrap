```tsx
<div className="d-flex flex-column gap-3">
  <div className="d-flex flex-wrap gap-3">
    <FormSelect
      aria-label="选择间距尺寸"
      className="w-auto"
      onChange={handleGutterChange}
      value={gutter}
    >
      <option value="g-0">g-0</option>
      <option value="g-1">g-1</option>
      <option value="g-2">g-2</option>
      <option value="g-3">g-3</option>
      <option value="g-4">g-4</option>
      <option value="g-5">g-5</option>
    </FormSelect>
    <FormCheck>
      <FormCheckInput
        checked={centered}
        id="layoutInteractiveCentered"
        onChange={handleCenteredChange}
        type="checkbox"
      />
      <FormCheckLabel htmlFor="layoutInteractiveCentered">
        垂直居中（align-items-center）
      </FormCheckLabel>
    </FormCheck>
  </div>
  <Row className={clsx(gutter, centered && 'align-items-center')}>
    <Col sm={4}>
      <FormControl aria-label="城市" placeholder="城市" />
    </Col>
    <Col sm={4}>
      <FormControl aria-label="省份" placeholder="省份" />
    </Col>
    <Col sm={4}>
      <FormCheck>
        <FormCheckInput id="layoutInteractiveCheck" />
        <FormCheckLabel htmlFor="layoutInteractiveCheck">记住我</FormCheckLabel>
      </FormCheck>
    </Col>
  </Row>
</div>
```
