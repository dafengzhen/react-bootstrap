```tsx
import { type ChangeEvent, useState } from 'react';

const [checkboxValues, setCheckboxValues] = useState<string[]>(['1']);

const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
  const { checked, value } = event.target;
  setCheckboxValues((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)));
};

<ButtonGroup aria-label="复选按钮组">
  <input
    autoComplete="off"
    checked={checkboxValues.includes('1')}
    className="btn-check"
    id="btn-check-1"
    onChange={handleCheckboxChange}
    type="checkbox"
    value="1"
  />
  <label className="btn btn-outline-primary" htmlFor="btn-check-1">
    选项 1
  </label>
  <input
    autoComplete="off"
    checked={checkboxValues.includes('2')}
    className="btn-check"
    id="btn-check-2"
    onChange={handleCheckboxChange}
    type="checkbox"
    value="2"
  />
  <label className="btn btn-outline-primary" htmlFor="btn-check-2">
    选项 2
  </label>
  <input
    autoComplete="off"
    checked={checkboxValues.includes('3')}
    className="btn-check"
    id="btn-check-3"
    onChange={handleCheckboxChange}
    type="checkbox"
    value="3"
  />
  <label className="btn btn-outline-primary" htmlFor="btn-check-3">
    选项 3
  </label>
</ButtonGroup>;
```
