```tsx
import { useState } from 'react';

const [clickCount, setClickCount] = useState(0);
const [loading, setLoading] = useState(false);

const handleLoadingClick = () => {
  setLoading(true);
  setTimeout(() => setLoading(false), 3000);
};

const handleCountClick = () => {
  setClickCount((prev) => prev + 1);
};

<div className="d-flex flex-wrap gap-3">
  <div className="d-flex flex-wrap gap-2 align-items-center">
    <Button
      loading={loading}
      loadingText="处理中..."
      onClick={handleLoadingClick}
      variant="primary"
    >
      点击触发加载
    </Button>
    <span className="text-muted small">
      {loading ? '模拟异步操作...' : '点击触发 3 秒加载状态'}
    </span>
  </div>

  <div className="d-flex flex-wrap gap-2 align-items-center">
    <Button onClick={handleCountClick} variant="success">
      点击计数: {clickCount}
    </Button>
    <span className="text-muted small">每次点击增加计数</span>
  </div>
</div>;
```
