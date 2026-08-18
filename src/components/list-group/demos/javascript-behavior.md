```tsx
<div className="row">
  <div className="col-4">
    <ListGroup as="div">
      <ListGroupItem action active={activeKey === 'home'} onClick={() => setActiveKey('home')}>
        首页
      </ListGroupItem>
      <ListGroupItem
        action
        active={activeKey === 'profile'}
        onClick={() => setActiveKey('profile')}
      >
        个人资料
      </ListGroupItem>
      <ListGroupItem
        action
        active={activeKey === 'messages'}
        onClick={() => setActiveKey('messages')}
      >
        消息
      </ListGroupItem>
      <ListGroupItem
        action
        active={activeKey === 'settings'}
        onClick={() => setActiveKey('settings')}
      >
        设置
      </ListGroupItem>
    </ListGroup>
  </div>
  <div className="col-8">
    <div className="tab-content">
      {activeKey === 'home' && (
        <div className="fade show tab-pane active" role="tabpanel">
          首页内容，这里是第一个选项卡的面板。
        </div>
      )}
      {activeKey === 'profile' && (
        <div className="fade show tab-pane active" role="tabpanel">
          个人资料内容，这里是第二个选项卡的面板。
        </div>
      )}
      {activeKey === 'messages' && (
        <div className="fade show tab-pane active" role="tabpanel">
          消息内容，这里是第三个选项卡的面板。
        </div>
      )}
      {activeKey === 'settings' && (
        <div className="fade show tab-pane active" role="tabpanel">
          设置内容，这里是第四个选项卡的面板。
        </div>
      )}
    </div>
  </div>
</div>
```
