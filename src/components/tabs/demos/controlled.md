```tsx
const [activeKey, setActiveKey] = useState('home');

<Tabs
  activeKey={activeKey}
  id="tabs-controlled-demo"
  onSelect={(key) => {
    if (key != null) {
      setActiveKey(String(key));
    }
  }}
>
  <Tab eventKey="home" title="首页">
    首页内容：当前激活的 key 由外部 state 控制。
  </Tab>
  <Tab eventKey="profile" title="个人资料">
    个人资料内容：切换标签会触发 onSelect 回调。
  </Tab>
  <Tab eventKey="messages" title="消息">
    消息内容：activeKey 与 onSelect 配合即可实现受控标签页。
  </Tab>
</Tabs>;
```
