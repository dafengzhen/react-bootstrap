```tsx
const [fluid, setFluid] = useState<boolean | ContainerFluid>(false);

const handleFluidChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const { value } = event.target;
  if (value === 'true') {
    setFluid(true);
  } else if (value === 'false') {
    setFluid(false);
  } else {
    setFluid(value as ContainerFluid);
  }
};

<FormSelect
  aria-label="选择容器模式"
  className="w-auto"
  onChange={handleFluidChange}
  value={String(fluid)}
>
  <option value="false">container</option>
  <option value="true">container-fluid</option>
  <option value="sm">container-sm</option>
  <option value="md">container-md</option>
  <option value="lg">container-lg</option>
  <option value="xl">container-xl</option>
  <option value="xxl">container-xxl</option>
</FormSelect>
<Container className="border bg-body-tertiary mt-3 p-3" fluid={fluid}>
  通过下拉框切换容器模式，观察宽度随视口与断点的变化
</Container>
```
