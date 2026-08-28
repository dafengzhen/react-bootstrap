```tsx
<Sidebar>
  <SidebarHeader>
    <SidebarTrigger>文档</SidebarTrigger>
  </SidebarHeader>
  <SidebarBody>
    <SidebarGroup>
      <SidebarGroupLabel>菜单</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarButton active>仪表盘</SidebarButton>
        <SidebarButton>订单中心</SidebarButton>
        <SidebarButton badge={<span className="badge text-bg-danger">3</span>}>
          消息通知
        </SidebarButton>
        <SidebarButton>设置</SidebarButton>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarBody>
</Sidebar>
```
