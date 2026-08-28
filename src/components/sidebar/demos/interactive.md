```tsx
<Sidebar>
  <SidebarBody>
    <SidebarGroup>
      <SidebarGroupLabel>导航</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarButton
          active={active === 'dashboard'}
          icon={<HomeIcon />}
          onClick={() => setActive('dashboard')}
        >
          仪表盘
        </SidebarButton>
        <SidebarButton
          active={active === 'orders'}
          icon={<FolderIcon />}
          onClick={() => setActive('orders')}
        >
          订单中心
        </SidebarButton>
        <SidebarButton
          badge={<span className="badge text-bg-danger">3</span>}
          icon={<BellIcon />}
          onClick={() => setActive('messages')}
        >
          消息通知
        </SidebarButton>
        <SidebarDivider />
        <SidebarButton disabled icon={<SettingsIcon />}>
          设置（未开放）
        </SidebarButton>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarBody>
</Sidebar>
```
