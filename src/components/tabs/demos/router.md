```tsx
import { Link } from 'react-router';

<Nav variant="pills">
  <NavItem>
    <Link aria-current="page" className="nav-link active" to="/components/tabs">
      当前页面
    </Link>
  </NavItem>
  <NavItem>
    <Link className="nav-link" to="/components/breadcrumb">
      Breadcrumb
    </Link>
  </NavItem>
  <NavItem>
    <Link className="nav-link" to="/components/pagination">
      Pagination
    </Link>
  </NavItem>
</Nav>;
```
