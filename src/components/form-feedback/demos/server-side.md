```tsx
<form className="row g-3 was-validated" noValidate>
  <div className="col-md-4">
    <label className="form-label" htmlFor="validationServer01">
      名字
    </label>
    <FormControl defaultValue="Mark" id="validationServer01" isValid required type="text" />
    <FormFeedback type="valid">看起来不错！</FormFeedback>
  </div>
  <div className="col-md-4">
    <label className="form-label" htmlFor="validationServer02">
      姓氏
    </label>
    <FormControl defaultValue="Otto" id="validationServer02" isValid required type="text" />
    <FormFeedback type="valid">看起来不错！</FormFeedback>
  </div>
  <div className="col-md-4">
    <label className="form-label" htmlFor="validationServerUsername">
      用户名
    </label>
    <FormControl
      aria-describedby="usernameFeedback"
      id="validationServerUsername"
      isInvalid
      required
      type="text"
    />
    <FormFeedback id="usernameFeedback" type="invalid">
      请填写用户名。
    </FormFeedback>
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationServer03">
      城市
    </label>
    <FormControl id="validationServer03" isInvalid required type="text" />
    <FormFeedback type="invalid">请填写有效的城市。</FormFeedback>
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationServer04">
      区/州
    </label>
    <FormSelect aria-label="选择区/州" defaultValue="" id="validationServer04" isInvalid required>
      <option disabled value="">
        请选择...
      </option>
      <option value="1">选项 1</option>
    </FormSelect>
    <FormFeedback type="invalid">请选择一个有效的区/州。</FormFeedback>
  </div>
  <div className="col-12">
    <Button type="submit" variant="primary">
      提交表单
    </Button>
  </div>
</form>
```
