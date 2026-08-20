```tsx
const [value, setValue] = useState(40);

const variant = value >= 100 ? 'success' : value >= 60 ? 'info' : 'warning';

const handleDecrease = () => {
  setValue((prev) => Math.max(0, prev - 10));
};

const handleIncrease = () => {
  setValue((prev) => Math.min(100, prev + 10));
};

const handleReset = () => {
  setValue(0);
};

<Progress animated={value < 100} height={20} label="上传进度" now={value} textBg variant={variant}>
  {value}%
</Progress>;

<div className="d-flex flex-wrap gap-2 mt-3">
  <Button onClick={handleDecrease} variant="outline-secondary">
    -10
  </Button>
  <Button onClick={handleIncrease} variant="outline-secondary">
    +10
  </Button>
  <Button onClick={handleReset} variant="outline-secondary">
    重置
  </Button>
</div>;
```
