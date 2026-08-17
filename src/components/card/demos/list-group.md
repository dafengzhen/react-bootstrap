```tsx
<Card style={{ width: '18rem' }}>
  <CardHeader>列表组</CardHeader>
  <ul className="list-group list-group-flush">
    <li className="list-group-item">列表项 1</li>
    <li className="list-group-item">列表项 2</li>
    <li className="list-group-item">列表项 3</li>
  </ul>
</Card>

<Card style={{ width: '18rem' }}>
  <ul className="list-group list-group-flush">
    <li aria-current="true" className="list-group-item active">
      激活的列表项
    </li>
    <li className="list-group-item">普通列表项</li>
    <li className="list-group-item disabled">禁用的列表项</li>
  </ul>
</Card>
```
