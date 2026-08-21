```tsx
<div
  className="border rounded mb-3 overflow-hidden"
  style={{ paddingTop: '4.5rem', transform: 'translateZ(0)' }}
>
  <Navbar bg="dark" data-bs-theme="dark" fixed="top">
    <div className="container-fluid">
      <NavbarBrand href="#navbar-placement-demo">fixed-top 导航栏</NavbarBrand>
    </div>
  </Navbar>
  <div className="p-3">
    fixed-top 固定在区块顶部，内容通过预留的顶部间距避免被遮挡；实际页面中为 body 添加
    padding-top 即可。
  </div>
</div>

<div
  className="border rounded mb-3 overflow-hidden"
  style={{ paddingBottom: '4.5rem', transform: 'translateZ(0)' }}
>
  <Navbar bg="dark" data-bs-theme="dark" fixed="bottom">
    <div className="container-fluid">
      <NavbarBrand href="#navbar-placement-demo">fixed-bottom 导航栏</NavbarBrand>
    </div>
  </Navbar>
  <div className="p-3">
    fixed-bottom 固定在区块底部，内容通过预留的底部间距避免被遮挡；实际页面中为 body 添加
    padding-bottom 即可。
  </div>
</div>

<div className="border rounded overflow-auto" style={{ height: 320 }}>
  <Navbar bg="dark" data-bs-theme="dark" sticky="top">
    <div className="container-fluid">
      <NavbarBrand href="#navbar-placement-demo">sticky-top 导航栏</NavbarBrand>
    </div>
  </Navbar>
  <div className="p-3">
    {Array.from({ length: 10 }, (_, index) => (
      <p className="mb-2" key={index}>
        滚动内容 {index + 1}，sticky-top 导航栏会吸附在滚动容器顶部。
      </p>
    ))}
  </div>
</div>
```
