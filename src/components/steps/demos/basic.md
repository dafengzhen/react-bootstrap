```tsx
<Steps active={1}>
  <StepsItem description="填写账户信息" title="填写信息" />
  <StepsItem description="选择支付方式" title="支付" />
  <StepsItem description="等待商家发货" title="发货" />
</Steps>

<Steps active={2} className="mt-4">
  <StepsItem description="第一步" title="登录" />
  <StepsItem description="第二步" title="验证" />
  <StepsItem description="第三步" title="结算" />
</Steps>
```
