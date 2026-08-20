```tsx
<>
  <Button
    aria-controls="collapse-events"
    aria-expanded={eventsOpen}
    onClick={() => setEventsOpen((prev) => !prev)}
    variant="primary"
  >
    切换折叠
  </Button>
  <span className="text-muted ms-2">最近事件：{lastEvent}</span>

  <Collapse
    id="collapse-events"
    in={eventsOpen}
    onEnter={() => setLastEvent('onEnter')}
    onEntered={() => setLastEvent('onEntered')}
    onEntering={() => setLastEvent('onEntering')}
    onExit={() => setLastEvent('onExit')}
    onExited={() => setLastEvent('onExited')}
    onExiting={() => setLastEvent('onExiting')}
  >
    <div className="card card-body mt-3">
      观察展开与折叠过程中依次触发的事件回调，对应 Bootstrap 的 show、shown、hide、hidden 事件。
    </div>
  </Collapse>
</>
```
