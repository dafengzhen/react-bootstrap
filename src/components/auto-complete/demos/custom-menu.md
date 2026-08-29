```tsx
<AutoComplete
  id="auto-complete-custom-demo"
  minLength={2}
  options={states}
  placeholder="自定义菜单..."
  renderMenu={(results, menuProps) => (
    <AutoCompleteMenu {...menuProps}>
      <div className="dropdown-header">搜索建议（{results.length} 条）</div>
      {results.map((option, index) => (
        <AutoCompleteItem key={index} option={option} position={index}>
          <span>{option}</span>
          <span className="ms-auto text-muted small">#{index + 1}</span>
        </AutoCompleteItem>
      ))}
    </AutoCompleteMenu>
  )}
/>
```
