```tsx
import { useState } from 'react';

const [liked, setLiked] = useState(false);
const [saving, setSaving] = useState(false);

const handleSave = () => {
  setSaving(true);
  setTimeout(() => setSaving(false), 3000);
};

<div className="d-flex flex-wrap gap-3">
  <div className="d-flex flex-wrap gap-2 align-items-center">
    <IconButton
      active={liked}
      label={liked ? '取消收藏' : '收藏'}
      onClick={() => setLiked((prev) => !prev)}
      toggle
      variant={liked ? 'danger' : 'outline-danger'}
    >
      <Heart fill={liked ? 'currentColor' : 'none'} size={18} />
    </IconButton>
    <span className="text-muted small">{liked ? '已收藏' : '点击收藏'}</span>
  </div>

  <div className="d-flex flex-wrap gap-2 align-items-center">
    <IconButton label="保存" loading={saving} onClick={handleSave} variant="primary">
      <Save size={18} />
    </IconButton>
    <span className="text-muted small">{saving ? '保存中...' : '点击触发 3 秒保存'}</span>
  </div>
</div>;
```
