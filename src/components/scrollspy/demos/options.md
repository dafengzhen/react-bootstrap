```tsx
const [rootMargin, setRootMargin] = useState('0px 0px -25%');
const [threshold, setThreshold] = useState([0.1, 0.5, 1]);

<>
  <div className="d-flex gap-3 mb-3">
    <select
      className="form-select form-select-sm"
      onChange={(event) => setRootMargin(event.target.value)}
      value={rootMargin}
    >
      <option value="0px 0px -25%">激活线起点：容器顶部（默认）</option>
      <option value="40px 0px -25%">激活线起点：顶部下方 40px</option>
      <option value="80px 0px -25%">激活线起点：顶部下方 80px</option>
      <option value="120px 0px -25%">激活线起点：顶部下方 120px</option>
    </select>
    <select
      className="form-select form-select-sm"
      onChange={(event) => setThreshold(event.target.value.split(',').map(Number))}
      value={threshold.join(',')}
    >
      <option value="0.1,0.5,1">threshold: [0.1, 0.5, 1]（默认）</option>
      <option value="0">threshold: 0</option>
      <option value="0.25,0.75">threshold: [0.25, 0.75]</option>
    </select>
  </div>
  <ScrollSpy rootMargin={rootMargin} smoothScroll threshold={threshold}>
    <div className="row">
      <div className="col-4">
        <nav className="nav nav-pills flex-column">
          <ScrollSpyLink className="nav-link" targetId="spy-options-1">
            区域一
          </ScrollSpyLink>
          <ScrollSpyLink className="nav-link" targetId="spy-options-2">
            区域二
          </ScrollSpyLink>
          <ScrollSpyLink className="nav-link" targetId="spy-options-3">
            区域三
          </ScrollSpyLink>
          <ScrollSpyLink className="nav-link" targetId="spy-options-4">
            区域四
          </ScrollSpyLink>
        </nav>
      </div>
      <div className="col-8">
        <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
          <h4 id="spy-options-1">区域一</h4>
          <p>
            这是区域一的内容。激活线与可见比例变化后，激活切换的时机也会随之改变，向下滚动观察切换位置的变化。
          </p>
          <h4 id="spy-options-2">区域二</h4>
          <p>
            这是区域二的内容。点击左侧导航链接可以平滑滚动到对应区域，滚动停止后激活项立即与目标区域同步。
          </p>
          <h4 id="spy-options-3">区域三</h4>
          <p>
            这是区域三的内容。rootMargin 顶部边距决定激活线的初始位置，激活线随滚动逐渐下移，
            底部边距与 threshold 决定可见比例门槛。
          </p>
          <h4 id="spy-options-4">区域四</h4>
          <p>
            这是区域四的内容。修改上方下拉框可以实时调整观察配置，滚动到底部时最后一项自动激活。
          </p>
        </ScrollSpyContainer>
      </div>
    </div>
  </ScrollSpy>
</>;
```
