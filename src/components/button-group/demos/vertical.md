```tsx
// radioValue 与 handleRadioChange 定义见「单选按钮组」示例
<ButtonGroup aria-label="垂直按钮组" vertical>
  <Button variant="primary">按钮 1</Button>
  <Button variant="primary">按钮 2</Button>
  <Button variant="primary">按钮 3</Button>
</ButtonGroup>

<ButtonGroup aria-label="垂直轮廓按钮组" vertical>
  <Button variant="outline-success">成功</Button>
  <Button variant="outline-warning">警告</Button>
  <Button variant="outline-danger">危险</Button>
</ButtonGroup>

<ButtonGroup aria-label="垂直单选按钮组" vertical>
  <input
    autoComplete="off"
    checked={radioValue === '1'}
    className="btn-check"
    id="vbtn-radio-1"
    name="vbtn-radio"
    onChange={handleRadioChange}
    type="radio"
    value="1"
  />
  <label className="btn btn-outline-danger" htmlFor="vbtn-radio-1">
    单选 1
  </label>
  <input
    autoComplete="off"
    checked={radioValue === '2'}
    className="btn-check"
    id="vbtn-radio-2"
    name="vbtn-radio"
    onChange={handleRadioChange}
    type="radio"
    value="2"
  />
  <label className="btn btn-outline-danger" htmlFor="vbtn-radio-2">
    单选 2
  </label>
  <input
    autoComplete="off"
    checked={radioValue === '3'}
    className="btn-check"
    id="vbtn-radio-3"
    name="vbtn-radio"
    onChange={handleRadioChange}
    type="radio"
    value="3"
  />
  <label className="btn btn-outline-danger" htmlFor="vbtn-radio-3">
    单选 3
  </label>
</ButtonGroup>
```
