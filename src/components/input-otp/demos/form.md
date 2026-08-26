```tsx
const [submitted, setSubmitted] = useState('');

const handleSubmit = (event) => {
  event.preventDefault();
  setSubmitted(String(new FormData(event.currentTarget).get('code') ?? ''));
};

<form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
  <InputOtp name="code" />
  <Button type="submit" variant="primary">
    提交
  </Button>
</form>;

<FormText muted>{submitted === '' ? '提交后在此显示表单值' : `已提交：${submitted}`}</FormText>;
```
