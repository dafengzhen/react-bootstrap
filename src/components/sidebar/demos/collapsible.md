```tsx
<Sidebar defaultCollapsed>
  <SidebarHeader>
    <SidebarTrigger />
  </SidebarHeader>
  <SidebarBody>
    <SidebarGroup>
      <SidebarGroupLabel>导航</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink href="#home" icon={<HomeIcon />}>
          首页
        </SidebarLink>
        <SidebarLink href="#stats" icon={<ChartIcon />}>
          统计
        </SidebarLink>
        <SidebarLink href="#settings" icon={<SettingsIcon />}>
          设置
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarBody>
</Sidebar>
```
