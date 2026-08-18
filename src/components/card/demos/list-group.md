```tsx
<Card style={{ width: '18rem' }}>
  <CardHeader>列表组</CardHeader>
  <ListGroup flush>
    <ListGroupItem>列表项 1</ListGroupItem>
    <ListGroupItem>列表项 2</ListGroupItem>
    <ListGroupItem>列表项 3</ListGroupItem>
  </ListGroup>
</Card>

<Card style={{ width: '18rem' }}>
  <ListGroup flush>
    <ListGroupItem active>激活的列表项</ListGroupItem>
    <ListGroupItem>普通列表项</ListGroupItem>
    <ListGroupItem disabled>禁用的列表项</ListGroupItem>
  </ListGroup>
</Card>
```
