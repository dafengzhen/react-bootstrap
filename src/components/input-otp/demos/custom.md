```tsx
const CustomOtpSlots = () => {
  const otp = useInputOtp();

  return (
    <div className="d-flex align-items-center gap-2">
      {otp?.slots.map((char, index) => (
        <Fragment key={index}>
          {index === 3 && <span className="text-muted">—</span>}
          <InputOtpSlot
            className={char === '' ? 'bg-secondary-subtle' : 'bg-primary-subtle'}
            index={index}
          />
        </Fragment>
      ))}
    </div>
  );
};

<InputOtp length={6}>
  <CustomOtpSlots />
</InputOtp>;
```
