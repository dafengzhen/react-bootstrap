```tsx
<form
  className={clsx('row g-3', wasValidated && 'was-validated')}
  noValidate
  onSubmit={handleBrowserSubmit}
>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationDefault01">
      名字
    </label>
    <FormControl defaultValue="Mark" id="validationDefault01" required type="text" />
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationDefault02">
      姓氏
    </label>
    <FormControl defaultValue="Otto" id="validationDefault02" required type="text" />
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationDefault03">
      城市
    </label>
    <FormControl id="validationDefault03" required type="text" />
    <FormFeedback type="invalid">请填写城市。</FormFeedback>
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationDefault04">
      邮编
    </label>
    <FormControl id="validationDefault04" pattern="[0-9]{6}" required type="text" />
    <FormFeedback type="invalid">请输入 6 位数字邮编。</FormFeedback>
  </div>
  <div className="col-12">
    <Button type="submit" variant="primary">
      提交表单
    </Button>
  </div>
  {browserSuccess ? <Alert variant="success">浏览器默认校验通过！</Alert> : null}
</form>
```
