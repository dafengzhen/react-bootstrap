```tsx
const [code, setCode] = useState('');

const handleClear = () => {
  setCode('');
};

const handleFill = () => {
  setCode('246813');
};

<InputOtp onChange={setCode} value={code} />;

<div className="d-flex gap-2 mt-3">
  <Button onClick={handleFill} variant="outline-secondary">
    填充
  </Button>
  <Button onClick={handleClear} variant="outline-secondary">
    清空
  </Button>
</div>;
```
