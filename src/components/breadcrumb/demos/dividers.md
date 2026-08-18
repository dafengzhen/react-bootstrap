```tsx
<Breadcrumb divider=">">
  <BreadcrumbItem href="#">首页</BreadcrumbItem>
  <BreadcrumbItem href="#">组件</BreadcrumbItem>
  <BreadcrumbItem active>Breadcrumb</BreadcrumbItem>
</Breadcrumb>

<Breadcrumb divider="→">
  <BreadcrumbItem href="#">首页</BreadcrumbItem>
  <BreadcrumbItem active>组件</BreadcrumbItem>
</Breadcrumb>

<Breadcrumb
  style={{
    '--bs-breadcrumb-divider':
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'%3E%3Cpath d=\'M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z\' fill=\'%236c757d\'/%3E%3C/svg%3E")',
  }}
>
  <BreadcrumbItem href="#">首页</BreadcrumbItem>
  <BreadcrumbItem active>组件</BreadcrumbItem>
</Breadcrumb>
```
