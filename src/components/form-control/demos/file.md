```tsx
<div className="d-flex flex-column gap-3">
  <div>
    <label className="form-label" htmlFor="formFile">
      默认文件输入示例
    </label>
    <FormControl id="formFile" type="file" />
  </div>
  <div>
    <label className="form-label" htmlFor="formFileMultiple">
      多文件输入示例
    </label>
    <FormControl id="formFileMultiple" multiple type="file" />
  </div>
  <div>
    <label className="form-label" htmlFor="formFileDisabled">
      禁用文件输入示例
    </label>
    <FormControl disabled id="formFileDisabled" type="file" />
  </div>
</div>
```
