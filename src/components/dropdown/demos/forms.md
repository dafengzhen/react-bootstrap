```tsx
<Dropdown>
  <DropdownToggle id="dropdown-form-demo" variant="secondary">
    表单菜单
  </DropdownToggle>
  <DropdownMenu as="form" className="p-4" onSubmit={(event) => event.preventDefault()}>
    <div className="mb-3">
      <label className="form-label" htmlFor="dropdown-form-email">
        邮箱地址
      </label>
      <input
        className="form-control"
        id="dropdown-form-email"
        placeholder="email@example.com"
        type="email"
      />
    </div>
    <div className="mb-3">
      <label className="form-label" htmlFor="dropdown-form-password">
        密码
      </label>
      <input
        className="form-control"
        id="dropdown-form-password"
        placeholder="Password"
        type="password"
      />
    </div>
    <div className="mb-3">
      <div className="form-check">
        <input className="form-check-input" id="dropdown-form-check" type="checkbox" />
        <label className="form-check-label" htmlFor="dropdown-form-check">
          记住我
        </label>
      </div>
    </div>
    <Button type="submit" variant="primary">
      登录
    </Button>
  </DropdownMenu>
</Dropdown>
```
