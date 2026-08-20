```tsx
<div className="row">
  <div className="col-4">
    <nav className="h-100 flex-column align-items-stretch pe-4 border-end" id="spy-nested-nav">
      <nav className="nav nav-pills flex-column">
        <a className="nav-link" href="#spy-nested-1">
          第一个
        </a>
        <nav className="nav nav-pills flex-column">
          <a className="nav-link ms-3 my-1" href="#spy-nested-1-1">
            第一个-1
          </a>
          <a className="nav-link ms-3 my-1" href="#spy-nested-1-2">
            第一个-2
          </a>
        </nav>
        <a className="nav-link" href="#spy-nested-2">
          第二个
        </a>
        <a className="nav-link" href="#spy-nested-3">
          第三个
        </a>
        <nav className="nav nav-pills flex-column">
          <a className="nav-link ms-3 my-1" href="#spy-nested-3-1">
            第三个-1
          </a>
          <a className="nav-link ms-3 my-1" href="#spy-nested-3-2">
            第三个-2
          </a>
        </nav>
      </nav>
    </nav>
  </div>
  <div className="col-8">
    <ScrollSpy target="#spy-nested-nav">
      <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
        <div id="spy-nested-1">
          <h5>第一个</h5>
          <p>
            这是第一个区域的内容。向下滚动容器，本区域的两个子区域标题会依次越过激活线，
            左侧嵌套导航中对应的链接随之激活。
          </p>
        </div>
        <div id="spy-nested-1-1">
          <h5>第一个-1</h5>
          <p>
            这是“第一个-1”子区域的内容。子区域与普通区域共用同一套激活机制，切换顺序由标题越过激活线的先后决定。
          </p>
        </div>
        <div id="spy-nested-1-2">
          <h5>第一个-2</h5>
          <p>这是“第一个-2”子区域的内容。继续向下滚动，激活项会切换到下一个子区域或区域。</p>
        </div>
        <div id="spy-nested-2">
          <h5>第二个</h5>
          <p>
            这是第二个区域的内容。向上滚动时，激活项会依次切换回前面的区域与子区域，与阅读位置保持一致。
          </p>
        </div>
        <div id="spy-nested-3">
          <h5>第三个</h5>
          <p>
            这是第三个区域的内容，同样包含两个子区域。滚动到子区域标题越过激活线时，对应链接会自动激活。
          </p>
        </div>
        <div id="spy-nested-3-1">
          <h5>第三个-1</h5>
          <p>
            这是“第三个-1”子区域的内容。本例的导航是普通 HTML，组件通过 target
            选择器直接管理其中链接的 active 类。
          </p>
        </div>
        <div id="spy-nested-3-2">
          <h5>第三个-2</h5>
          <p>
            这是“第三个-2”子区域的内容。滚动到容器底部时，最后一个链接会自动激活，保证导航始终有选中的项。
          </p>
        </div>
      </ScrollSpyContainer>
    </ScrollSpy>
  </div>
</div>
```
