```tsx
import { type ChangeEvent, useState } from 'react';

const [radioValue, setRadioValue] = useState('1');

const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
  setRadioValue(event.target.value);
};

<ButtonGroup aria-label="单选按钮组">
  <input
    autoComplete="off"
    checked={radioValue === '1'}
    className="btn-check"
    id="btn-radio-1"
    name="btn-radio"
    onChange={handleRadioChange}
    type="radio"
    value="1"
  />
  <label className="btn btn-outline-danger" htmlFor="btn-radio-1">
    单选 1
  </label>
  <input
    autoComplete="off"
    checked={radioValue === '2'}
    className="btn-check"
    id="btn-radio-2"
    name="btn-radio"
    onChange={handleRadioChange}
    type="radio"
    value="2"
  />
  <label className="btn btn-outline-danger" htmlFor="btn-radio-2">
    单选 2
  </label>
  <input
    autoComplete="off"
    checked={radioValue === '3'}
    className="btn-check"
    id="btn-radio-3"
    name="btn-radio"
    onChange={handleRadioChange}
    type="radio"
    value="3"
  />
  <label className="btn btn-outline-danger" htmlFor="btn-radio-3">
    单选 3
  </label>
</ButtonGroup>;
```
