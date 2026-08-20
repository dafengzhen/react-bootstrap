```tsx
<ScrollSpy>
  <nav
    className="nav nav-pills flex-column bg-body mb-3 position-sticky rounded shadow-sm"
    style={{ top: '0.5rem', zIndex: 1 }}
  >
    <ScrollSpyLink className="nav-link" targetId="spy-window-1">
      区域一
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-window-2">
      区域二
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-window-3">
      区域三
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-window-4">
      区域四
    </ScrollSpyLink>
  </nav>
  <ScrollSpyContainer>
    <h4 id="spy-window-1">区域一</h4>
    <p>
      当 ScrollSpyContainer 未设置滚动溢出样式（overflow-y 为
      visible）时，监听根自动切换为浏览器视口，此时滚动整个页面即可切换导航激活状态，等价于
      Bootstrap 中在 body 上初始化 ScrollSpy。上方导航在页面滚动时固定在视口顶部，方便观察激活变化。
    </p>
    <h4 id="spy-window-2">区域二</h4>
    <p>
      继续向下滚动页面，“区域二”的标题滚动到视口顶部（激活线）时，导航中的对应链接会被激活。
      每个区域的标题越过激活线后，其链接保持激活，直到下一个标题到达。
    </p>
    <h4 id="spy-window-3">区域三</h4>
    <p>
      激活线的位置由 rootMargin 的顶部边距决定，可见比例门槛由 threshold
      决定。向上滚动页面时，激活项会依次切换回前面的区域。
    </p>
    <h4 id="spy-window-4">区域四</h4>
    <p>
      这是最后一个区域的内容。页面滚动到底部时，最后一个链接自动激活（与 Bootstrap 在 body 上使用
      ScrollSpy 的 maxScroll 行为一致）。
    </p>
  </ScrollSpyContainer>
</ScrollSpy>
```
