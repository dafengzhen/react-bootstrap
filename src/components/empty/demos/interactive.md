```tsx
const fruits = ['苹果', '香蕉', '樱桃', '榴莲', '芒果'];
const [keyword, setKeyword] = useState('');
const results = fruits.filter((fruit) => fruit.includes(keyword));

<>
  <FormControl
    onChange={(event) => setKeyword(event.target.value)}
    placeholder="输入关键字筛选，试试「葡萄」"
    value={keyword}
  />

  {results.length > 0 ? (
    <ul className="list-group mt-3">
      {results.map((fruit) => (
        <li className="list-group-item" key={fruit}>
          {fruit}
        </li>
      ))}
    </ul>
  ) : (
    <Empty
      description={`没有找到与「${keyword}」匹配的结果`}
      image={<EmptyImage bg="warning" height={100} label="无结果" width={160} />}
      title="未找到匹配项"
    >
      <Button onClick={() => setKeyword('')} variant="outline-secondary">
        清除搜索
      </Button>
    </Empty>
  )}
</>;
```
