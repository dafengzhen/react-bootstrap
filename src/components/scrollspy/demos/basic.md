```tsx
<ScrollSpy>
  <nav className="nav nav-pills flex-column mb-3">
    <ScrollSpyLink className="nav-link" targetId="spy-basic-1">
      第一个
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-basic-2">
      第二个
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-basic-3">
      第三个
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-basic-4">
      第四个
    </ScrollSpyLink>
    <ScrollSpyLink className="nav-link" targetId="spy-basic-5">
      第五个
    </ScrollSpyLink>
  </nav>
  <ScrollSpyContainer className="scrollspy-example bg-body-tertiary p-3 rounded-2">
    <h4 id="spy-basic-1">第一个标题</h4>
    <p>
      这是第一个区域的内容。向下滚动容器，每个区域的标题会依次越过容器顶部的激活线，导航中的对应链接随之自动高亮。
      当前标题越过激活线后，其链接会一直保持激活，直到下一个标题到达，确保激活项始终跟随阅读位置。
    </p>
    <h4 id="spy-basic-2">第二个标题</h4>
    <p>
      这是第二个区域的内容。激活状态由滚动位置实时计算，切换时机由 rootMargin
      顶部边距决定的激活线控制。继续向下滚动，后续区域的标题会依次越过激活线，导航激活项随之逐个切换。
    </p>
    <h4 id="spy-basic-3">第三个标题</h4>
    <p>
      这是第三个区域的内容。向上滚动时，激活项会按照相反的顺序逐个切换回前面的区域，与阅读位置保持一致。
      点击上方导航链接可以直接跳转到对应区域，跳转后激活项立即同步。
    </p>
    <h4 id="spy-basic-4">第四个标题</h4>
    <p>
      这是第四个区域的内容。每个区域都包含足够的内容，保证在滚动过程中后一个区域的标题能够到达激活线，
      从而依次触发导航切换，中间不会出现空档或跳项。
    </p>
    <h4 id="spy-basic-5">第五个标题</h4>
    <p>
      这是最后一个区域的内容。当容器滚动到底部时，最后一个链接会自动激活（与 Bootstrap 的 maxScroll
      行为一致），保证导航始终有选中的项。
    </p>
  </ScrollSpyContainer>
</ScrollSpy>
```
