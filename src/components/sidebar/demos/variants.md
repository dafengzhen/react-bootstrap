```tsx
<div className="d-flex flex-wrap gap-3">
  <div
    className="border overflow-hidden rounded"
    style={{ height: 440, '--rbs-sidebar-height': '100%' }}
  >
    <Sidebar variant="dark">
      <SidebarHeader>
        <span className="fw-semibold">深色主题</span>
      </SidebarHeader>
      <SidebarBody>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarLink active href="#a" icon={<HomeIcon />}>
              首页
            </SidebarLink>
            <SidebarLink href="#b" icon={<ChartIcon />}>
              统计
            </SidebarLink>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarBody>
    </Sidebar>
  </div>

  <div
    className="border overflow-hidden rounded"
    style={{ height: 440, '--rbs-sidebar-height': '100%' }}
  >
    <Sidebar placement="end">
      <SidebarHeader>
        <span className="fw-semibold">右侧停靠</span>
      </SidebarHeader>
      <SidebarBody>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarLink active href="#c" icon={<HomeIcon />}>
              首页
            </SidebarLink>
            <SidebarLink href="#d" icon={<ChartIcon />}>
              统计
            </SidebarLink>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarBody>
    </Sidebar>
  </div>
</div>
```
