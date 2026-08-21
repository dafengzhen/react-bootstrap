```tsx
<div className="row g-3">
  <div className="col-sm-6">
    <label className="form-label" htmlFor="inputPassword5">
      密码
    </label>
    <FormControl aria-describedby="passwordHelpBlock" id="inputPassword5" type="password" />
    <FormText as="div" id="passwordHelpBlock">
      你的密码必须为 8-20 个字符，包含字母和数字，且不能包含空格、特殊字符或表情符号。
    </FormText>
  </div>
  <div className="col-sm-6">
    <label className="form-label" htmlFor="inputPassword6">
      密码
    </label>
    <FormControl aria-describedby="passwordHelpInline" id="inputPassword6" type="password" />
    <FormText id="passwordHelpInline" muted>
      建议使用混合大小写字母与数字。
    </FormText>
  </div>
</div>
```
