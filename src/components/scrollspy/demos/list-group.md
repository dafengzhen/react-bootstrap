```tsx
<div className="row">
  <div className="col-4">
    <div className="list-group" id="spy-list-nav">
      <a className="list-group-item list-group-item-action" href="#spy-list-1">
        列表项 1
      </a>
      <a className="list-group-item list-group-item-action" href="#spy-list-2">
        列表项 2
      </a>
      <a className="list-group-item list-group-item-action" href="#spy-list-3">
        列表项 3
      </a>
      <a className="list-group-item list-group-item-action" href="#spy-list-4">
        列表项 4
      </a>
    </div>
  </div>
  <div className="col-8">
    <ScrollSpy target="#spy-list-nav">
      <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
        <h4 id="spy-list-1">列表项 1</h4>
        <p>
          这是第一个列表项对应的内容区域。向下滚动容器，后续列表项的标题会依次越过激活线，
          左侧列表组中对应的项随之激活。
        </p>
        <h4 id="spy-list-2">列表项 2</h4>
        <p>
          这是第二个列表项对应的内容区域。激活的列表项会渲染 active 类，与 Bootstrap 中
          list-group-item 的激活样式保持一致。
        </p>
        <h4 id="spy-list-3">列表项 3</h4>
        <p>
          这是第三个列表项对应的内容区域。继续向下滚动即可切换到下一个列表项，向上滚动则依次返回。
        </p>
        <h4 id="spy-list-4">列表项 4</h4>
        <p>
          这是第四个列表项对应的内容区域。滚动到底部时，最后一个列表项自动激活，保证导航始终有选中的项。
        </p>
      </ScrollSpyContainer>
    </ScrollSpy>
  </div>
</div>
```
