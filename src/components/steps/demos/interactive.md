```tsx
const [active, setActive] = useState(0);

const steps = [
  { description: '填写账户信息并完成实名认证', title: '填写信息' },
  { description: '选择支付方式并完成付款', title: '支付' },
  { description: '商家确认后尽快安排发货', title: '发货' },
];

<Steps active={active} onChange={setActive}>
  {steps.map((step) => (
    <StepsItem description={step.description} key={step.title} title={step.title} />
  ))}
</Steps>;

<div className="d-flex gap-2 mt-4">
  <Button
    disabled={active === 0}
    onClick={() => setActive((prev) => prev - 1)}
    variant="outline-secondary"
  >
    上一步
  </Button>
  <Button
    disabled={active === steps.length - 1}
    onClick={() => setActive((prev) => prev + 1)}
    variant="primary"
  >
    下一步
  </Button>
</div>;
```
