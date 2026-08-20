```tsx
const [activeId, setActiveId] = useState('spy-controlled-1');

<>
  <ScrollSpy
    activeId={activeId}
    onActivate={(id) => {
      setActiveId(id ?? '');
    }}
  >
    <div className="mb-3">
      <ScrollSpyLink className="btn btn-outline-primary btn-sm me-2" targetId="spy-controlled-1">
        跳到区域一
      </ScrollSpyLink>
      <ScrollSpyLink className="btn btn-outline-primary btn-sm me-2" targetId="spy-controlled-2">
        跳到区域二
      </ScrollSpyLink>
      <ScrollSpyLink className="btn btn-outline-primary btn-sm me-2" targetId="spy-controlled-3">
        跳到区域三
      </ScrollSpyLink>
    </div>
    <div className="row">
      <div className="col-4">
        <nav className="nav nav-pills flex-column">
          <ScrollSpyLink className="nav-link" targetId="spy-controlled-1">
            区域一
          </ScrollSpyLink>
          <ScrollSpyLink className="nav-link" targetId="spy-controlled-2">
            区域二
          </ScrollSpyLink>
          <ScrollSpyLink className="nav-link" targetId="spy-controlled-3">
            区域三
          </ScrollSpyLink>
        </nav>
      </div>
      <div className="col-8">
        <ScrollSpyContainer className="scrollspy-example" tabIndex={0}>
          <h4 id="spy-controlled-1">区域一</h4>
          <p>
            这是第一个区域的内容。当前激活的区域由外部 state 控制，滚动容器时 onActivate
            回调会更新该 state，激活项跟随阅读位置变化。
          </p>
          <h4 id="spy-controlled-2">区域二</h4>
          <p>
            这是第二个区域的内容。点击上方按钮可以跳转到对应区域，按钮复用了 ScrollSpyLink
            的滚动逻辑，跳转后激活项立即同步。
          </p>
          <h4 id="spy-controlled-3">区域三</h4>
          <p>
            这是第三个区域的内容。滚动到容器底部时，最后一个链接自动激活，与 Bootstrap 的 maxScroll
            行为一致。
          </p>
        </ScrollSpyContainer>
      </div>
    </div>
  </ScrollSpy>
  <p className="mb-0 mt-3 text-muted small">当前激活的区域：{activeId || '无'}</p>
</>;
```
