```tsx
<Sidebar breakpoint="lg">
  <SidebarHeader>
    <SidebarTrigger>导航</SidebarTrigger>
  </SidebarHeader>
  <SidebarBody>
    <SidebarGroup>
      <SidebarGroupLabel>导航</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink active href="#overview" icon={<HomeIcon />}>
          概览
        </SidebarLink>
        <SidebarLink href="#reports" icon={<ChartIcon />}>
          报表
        </SidebarLink>
        <SidebarLink href="#messages" icon={<ChatIcon />}>
          消息
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarBody>
</Sidebar>
```
