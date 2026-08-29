```tsx
<div className="d-flex flex-column align-items-start gap-3">
  <div className="d-flex flex-wrap gap-2 align-items-center">
    <ButtonGroup>
      <IconButton label="加粗">
        <Bold size={16} />
      </IconButton>
      <IconButton label="斜体">
        <Italic size={16} />
      </IconButton>
      <IconButton label="下划线">
        <Underline size={16} />
      </IconButton>
    </ButtonGroup>
    <ButtonGroup size="sm">
      <IconButton label="加粗">
        <Bold size={14} />
      </IconButton>
      <IconButton label="斜体">
        <Italic size={14} />
      </IconButton>
      <IconButton label="下划线">
        <Underline size={14} />
      </IconButton>
    </ButtonGroup>
  </div>
  <ButtonGroup>
    <Button variant="primary">
      <Plus size={16} /> 新建
    </Button>
    <IconButton label="删除" variant="danger">
      <Trash2 size={16} />
    </IconButton>
  </ButtonGroup>
</div>
```
