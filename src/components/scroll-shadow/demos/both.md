```tsx
<ScrollShadow className="border rounded-3" direction="both" style={{ height: 280 }}>
  <table className="table table-bordered table-striped mb-0" style={{ minWidth: 720 }}>
    <thead>
      <tr>
        {Array.from({ length: 8 }, (_, index) => (
          <th key={index}>列 {index + 1}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 18 }, (_, row) => (
        <tr key={row}>
          {Array.from({ length: 8 }, (_, column) => (
            <td key={column}>
              R{row + 1} C{column + 1}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</ScrollShadow>
```
