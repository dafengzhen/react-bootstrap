```tsx
<form className="row g-3" noValidate onSubmit={handleInteractiveSubmit}>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationCustomEmail">
      邮箱
    </label>
    <FormControl
      id="validationCustomEmail"
      isInvalid={submitted && !isValidEmail}
      isValid={submitted && isValidEmail}
      onChange={handleEmailChange}
      placeholder="name@example.com"
      required
      type="email"
      value={email}
    />
    <FormFeedback type="valid">邮箱格式正确！</FormFeedback>
    <FormFeedback type="invalid">请输入有效的邮箱地址。</FormFeedback>
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationCustomPassword">
      密码
    </label>
    <FormControl
      id="validationCustomPassword"
      isInvalid={submitted && !isValidPassword}
      isValid={submitted && isValidPassword}
      onChange={handlePasswordChange}
      placeholder="至少 8 位字符"
      required
      type="password"
      value={password}
    />
    <FormFeedback type="valid">密码符合要求！</FormFeedback>
    <FormFeedback type="invalid">密码长度至少为 8 位。</FormFeedback>
  </div>
  <div className="col-md-6">
    <label className="form-label" htmlFor="validationCustomCity">
      城市
    </label>
    <FormSelect
      id="validationCustomCity"
      isInvalid={submitted && city === ''}
      isValid={submitted && city !== ''}
      onChange={handleCityChange}
      required
      value={city}
    >
      <option value="">请选择...</option>
      <option value="beijing">北京</option>
      <option value="shanghai">上海</option>
      <option value="guangzhou">广州</option>
      <option value="shenzhen">深圳</option>
    </FormSelect>
    <FormFeedback type="invalid">请选择一个城市。</FormFeedback>
  </div>
  <div className="col-12">
    <FormCheck>
      <FormCheckInput
        checked={agreed}
        id="validationCustomAgree"
        isInvalid={submitted && !agreed}
        onChange={handleAgreedChange}
        required
      />
      <FormCheckLabel htmlFor="validationCustomAgree">同意条款与条件</FormCheckLabel>
      <FormFeedback type="invalid">请先同意条款与条件。</FormFeedback>
    </FormCheck>
  </div>
  <div className="col-12">
    <Button type="submit" variant="primary">
      提交表单
    </Button>
  </div>
  {submitted && isValid ? <Alert variant="success">表单校验通过！</Alert> : null}
</form>
```
