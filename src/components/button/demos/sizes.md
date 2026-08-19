```tsx
import type { CSSProperties } from 'react';

<div className="d-flex flex-wrap gap-2 align-items-center">
  <Button size="sm" variant="primary">
    小按钮 (sm)
  </Button>
  <Button variant="primary">默认尺寸</Button>
  <Button size="lg" variant="primary">
    大按钮 (lg)
  </Button>
  <Button
    style={
      {
        '--bs-btn-font-size': '.75rem',
        '--bs-btn-padding-x': '.5rem',
        '--bs-btn-padding-y': '.25rem',
      } as CSSProperties
    }
    variant="primary"
  >
    自定义尺寸
  </Button>
</div>;
```
