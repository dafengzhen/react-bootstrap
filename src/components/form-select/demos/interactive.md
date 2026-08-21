```tsx
<FormSelect aria-label="选择编程语言" onChange={handleChange} value={language}>
  <option value="typescript">TypeScript</option>
  <option value="javascript">JavaScript</option>
  <option value="python">Python</option>
  <option value="go">Go</option>
</FormSelect>
<FormText muted>你选择了：{language}</FormText>
```
