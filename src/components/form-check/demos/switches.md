```tsx
<FormCheck type="switch">
  <FormCheckInput id="switchCheckDefault" role="switch" />
  <FormCheckLabel htmlFor="switchCheckDefault">默认开关</FormCheckLabel>
</FormCheck>

<FormCheck type="switch">
  <FormCheckInput defaultChecked id="switchCheckChecked" role="switch" />
  <FormCheckLabel htmlFor="switchCheckChecked">已选中的开关</FormCheckLabel>
</FormCheck>

<FormCheck type="switch">
  <FormCheckInput disabled id="switchCheckDisabled" role="switch" />
  <FormCheckLabel htmlFor="switchCheckDisabled">禁用的开关</FormCheckLabel>
</FormCheck>

<FormCheck type="switch">
  <FormCheckInput defaultChecked disabled id="switchCheckCheckedDisabled" role="switch" />
  <FormCheckLabel htmlFor="switchCheckCheckedDisabled">禁用且选中的开关</FormCheckLabel>
</FormCheck>
```
