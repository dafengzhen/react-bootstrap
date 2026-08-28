```tsx
<Sidebar>
  <SidebarHeader>
    <span className="fw-semibold">工作台</span>
  </SidebarHeader>
  <SidebarBody>
    <FormControl className="mb-3" placeholder="搜索内容…" size="sm" />
    <SidebarGroup>
      <SidebarGroupLabel>项目</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink active href="#project" icon={<FolderIcon />}>
          当前项目
        </SidebarLink>
        <SidebarLink href="#archive" icon={<BookIcon />}>
          归档
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
    <div className="px-3 py-2">
      <Progress now={68} />
    </div>
  </SidebarBody>
  <SidebarFooter>
    <span className="small text-secondary">v0.1.0</span>
  </SidebarFooter>
</Sidebar>
```
