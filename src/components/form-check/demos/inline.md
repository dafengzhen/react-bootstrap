```tsx
<div>
  <FormCheck inline>
    <FormCheckInput defaultChecked id="inlineCheckbox1" />
    <FormCheckLabel htmlFor="inlineCheckbox1">1</FormCheckLabel>
  </FormCheck>
  <FormCheck inline>
    <FormCheckInput defaultChecked id="inlineCheckbox2" />
    <FormCheckLabel htmlFor="inlineCheckbox2">2</FormCheckLabel>
  </FormCheck>
  <FormCheck inline>
    <FormCheckInput disabled id="inlineCheckbox3" />
    <FormCheckLabel htmlFor="inlineCheckbox3">3（禁用）</FormCheckLabel>
  </FormCheck>
</div>

<div className="mt-3">
  <FormCheck inline>
    <FormCheckInput defaultChecked id="inlineRadio1" name="inlineRadioOptions" type="radio" />
    <FormCheckLabel htmlFor="inlineRadio1">1</FormCheckLabel>
  </FormCheck>
  <FormCheck inline>
    <FormCheckInput id="inlineRadio2" name="inlineRadioOptions" type="radio" />
    <FormCheckLabel htmlFor="inlineRadio2">2</FormCheckLabel>
  </FormCheck>
  <FormCheck inline>
    <FormCheckInput disabled id="inlineRadio3" name="inlineRadioOptions" type="radio" />
    <FormCheckLabel htmlFor="inlineRadio3">3（禁用）</FormCheckLabel>
  </FormCheck>
</div>
```
