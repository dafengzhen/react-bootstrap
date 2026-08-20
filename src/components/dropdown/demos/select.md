```tsx
const [selected, setSelected] = useState('未选择');

<Dropdown
  onSelect={(eventKey) => {
    if (eventKey != null) {
      setSelected(String(eventKey));
    }
  }}
>
  <DropdownToggle id="dropdown-select-demo" variant="info">
    选择操作
  </DropdownToggle>
  <DropdownMenu>
    <DropdownItem eventKey="edit">编辑</DropdownItem>
    <DropdownItem eventKey="copy">复制</DropdownItem>
    <DropdownItem eventKey="delete">删除</DropdownItem>
  </DropdownMenu>
</Dropdown>;

<p className="mb-0 mt-3 text-muted small">当前选择：{selected}</p>;
```
