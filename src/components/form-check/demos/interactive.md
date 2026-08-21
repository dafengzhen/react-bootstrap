```tsx
import { type ChangeEvent, useState } from 'react';

const [checked, setChecked] = useState(true);
const [switched, setSwitched] = useState(false);
const [radioValue, setRadioValue] = useState('option1');

const handleCheckedChange = (event: ChangeEvent<HTMLInputElement>) => {
  setChecked(event.target.checked);
};

const handleSwitchedChange = (event: ChangeEvent<HTMLInputElement>) => {
  setSwitched(event.target.checked);
};

const handleRadioValueChange = (event: ChangeEvent<HTMLInputElement>) => {
  setRadioValue(event.target.value);
};

<div className="d-flex flex-column gap-3">
  <FormCheck>
    <FormCheckInput checked={checked} id="interactiveCheck" onChange={handleCheckedChange} />
    <FormCheckLabel htmlFor="interactiveCheck">
      复选框（{checked ? '已选中' : '未选中'}）
    </FormCheckLabel>
  </FormCheck>

  <FormCheck type="switch">
    <FormCheckInput
      checked={switched}
      id="interactiveSwitch"
      onChange={handleSwitchedChange}
      role="switch"
    />
    <FormCheckLabel htmlFor="interactiveSwitch">开关（{switched ? '开' : '关'}）</FormCheckLabel>
  </FormCheck>

  <FormCheck>
    <FormCheckInput
      checked={radioValue === 'option1'}
      id="interactiveRadio1"
      name="interactiveRadio"
      onChange={handleRadioValueChange}
      type="radio"
      value="option1"
    />
    <FormCheckLabel htmlFor="interactiveRadio1">选项 1</FormCheckLabel>
  </FormCheck>

  <FormCheck>
    <FormCheckInput
      checked={radioValue === 'option2'}
      id="interactiveRadio2"
      name="interactiveRadio"
      onChange={handleRadioValueChange}
      type="radio"
      value="option2"
    />
    <FormCheckLabel htmlFor="interactiveRadio2">选项 2</FormCheckLabel>
  </FormCheck>
</div>;
```
