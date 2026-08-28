```tsx
const [aspectRatio, setAspectRatio] = useState<number | RatioAspectRatio>('16x9');

const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const { value } = event.target;

  if (value.startsWith('custom:')) {
    setAspectRatio(Number.parseFloat(value.slice('custom:'.length)));
  } else {
    setAspectRatio(value as RatioAspectRatio);
  }
};

<div className="d-flex flex-column gap-3">
  <FormSelect
    aria-label="选择宽高比"
    className="w-auto"
    onChange={handleChange}
    value={typeof aspectRatio === 'number' ? `custom:${aspectRatio}` : aspectRatio}
  >
    <option value="1x1">1x1</option>
    <option value="4x3">4x3</option>
    <option value="16x9">16x9</option>
    <option value="21x9">21x9</option>
    <option value="custom:0.5">0.5（50%）</option>
    <option value="custom:0.75">0.75（75%）</option>
    <option value="custom:1">1（100%）</option>
    <option value="custom:2">2（200%）</option>
  </FormSelect>
  <Ratio
    aspectRatio={aspectRatio}
    className="bg-body-tertiary rounded"
    style={{ maxWidth: '36rem' }}
  >
    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
      {typeof aspectRatio === 'number' ? `${aspectRatio * 100}%` : aspectRatio}
    </div>
  </Ratio>
</div>;
```
