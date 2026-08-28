```tsx
<Sidebar>
  <SidebarHeader>
    <span className="fw-semibold">管理后台</span>
  </SidebarHeader>
  <SidebarBody>
    <SidebarGroup>
      <SidebarGroupLabel>总览</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink active href="#dashboard" icon={<HomeIcon />}>
          仪表盘
        </SidebarLink>
        <SidebarLink href="#stats" icon={<ChartIcon />}>
          数据统计
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
    <SidebarDivider />
    <SidebarGroup>
      <SidebarGroupLabel>内容</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink
          badge={<span className="badge text-bg-primary">12</span>}
          href="#posts"
          icon={<BookIcon />}
        >
          文章管理
        </SidebarLink>
        <SidebarLink href="#files" icon={<FolderIcon />}>
          文件库
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarBody>
  <SidebarFooter>
    <SidebarButton icon={<UserIcon />}>个人中心</SidebarButton>
  </SidebarFooter>
</Sidebar>
```
