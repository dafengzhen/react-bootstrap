```tsx
<form className="row g-3">
  <div className="col-sm-6">
    <label className="col-form-label" htmlFor="staticEmail">
      邮箱
    </label>
    <FormControl defaultValue="email@example.com" id="staticEmail" plaintext readOnly type="text" />
  </div>
  <div className="col-sm-6">
    <label className="col-form-label" htmlFor="inputPassword">
      密码
    </label>
    <FormControl id="inputPassword" placeholder="请输入密码" type="password" />
  </div>
</form>
```
