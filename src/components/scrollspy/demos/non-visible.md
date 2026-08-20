```tsx
<div className="row">
  <div className="col-4">
    <nav className="nav nav-pills flex-column" id="spy-hidden-nav">
      <a className="nav-link" href="#spy-hidden-1">
        可见区域
      </a>
      <a className="nav-link" href="#spy-hidden-2">
        隐藏区域
      </a>
      <a className="nav-link disabled" href="#spy-hidden-3">
        禁用链接
      </a>
      <a className="nav-link" href="#spy-hidden-4">
        另一个区域
      </a>
    </nav>
  </div>
  <div className="col-8">
    <ScrollSpy target="#spy-hidden-nav">
      <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
        <h4 id="spy-hidden-1">可见区域</h4>
        <p>
          这是一个正常可见的区域，向下滚动时它会正常激活对应链接。本区域包含足够的内容，
          保证后续区域能够依次到达激活线。
        </p>
        <h4 className="d-none" id="spy-hidden-2">
          隐藏区域
        </h4>
        <p className="d-none">
          设置了 display: none 的区域不会被监听，因此“隐藏区域”链接永远不会被激活。
        </p>
        <h4 id="spy-hidden-4">另一个区域</h4>
        <p>
          滚动到这里时，“另一个区域”链接会被激活。“禁用链接”由于带 disabled
          类被跳过，始终保持不可交互状态。
        </p>
      </ScrollSpyContainer>
    </ScrollSpy>
  </div>
</div>
```
