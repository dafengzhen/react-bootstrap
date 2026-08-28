```tsx
<SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
  <div className="align-items-center d-flex gap-2 mb-3">
    <SidebarTrigger />
    <Button onClick={() => setCollapsed(!collapsed)} size="sm" variant="outline-secondary">
      {collapsed ? '展开侧边栏' : '收起侧边栏'}
    </Button>
  </div>
  <div
    className="border overflow-hidden rounded"
    style={{ height: 420, '--rbs-sidebar-height': '100%' }}
  >
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger>受控模式</SidebarTrigger>
      </SidebarHeader>
      <SidebarBody>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarButton active icon={<HomeIcon />}>
              首页
            </SidebarButton>
            <SidebarButton icon={<SettingsIcon />}>设置</SidebarButton>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarBody>
    </Sidebar>
  </div>
</SidebarProvider>
```
