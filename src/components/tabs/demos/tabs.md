```tsx
<Tabs className="mb-3" defaultActiveKey="home" id="tabs-demo">
  <Tab eventKey="home" title="首页">
    首页内容：这是通过 Tabs 与 Tab 声明的第一个面板。
  </Tab>
  <Tab eventKey="profile" title="个人资料">
    个人资料内容：点击上方标签切换面板，无需 Bootstrap JS。
  </Tab>
  <Tab disabled eventKey="contact" title="禁用标签">
    禁用标签无法被选中，也不会渲染可交互的触发按钮。
  </Tab>
</Tabs>

<Tabs defaultActiveKey="first" id="tabs-pills-demo" transition variant="pills">
  <Tab eventKey="first" title="第一个">
    胶囊样式的标签页，切换时带有淡入动画。
  </Tab>
  <Tab eventKey="second" title="第二个">
    通过 variant 与 transition 属性分别控制样式与动画。
  </Tab>
</Tabs>
```
