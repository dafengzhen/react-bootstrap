```tsx
const [completed, setCompleted] = useState('');

<InputOtp onComplete={setCompleted} />;

<FormText muted>
  {completed === '' ? '输入完成后触发 onComplete' : `已完成：${completed}`}
</FormText>;
```
