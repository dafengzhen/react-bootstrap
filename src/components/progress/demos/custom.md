```tsx
<Progress bar={false} label="手动组合示例" now={70}>
  <ProgressBar now={30} />
  <ProgressBar now={20} variant="success" />
  <ProgressBar now={20} variant="info" />
</Progress>

<Progress bar={false} className="mt-3" label="工具类宽度示例" now={75}>
  <ProgressBar className="w-75" />
</Progress>
```
