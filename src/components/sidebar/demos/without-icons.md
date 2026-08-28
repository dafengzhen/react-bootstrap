```tsx
<Sidebar>
  <SidebarHeader>
    <span className="fw-semibold">文档</span>
  </SidebarHeader>
  <SidebarBody>
    <SidebarGroup>
      <SidebarGroupLabel>指南</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink active href="#intro">
          快速开始
        </SidebarLink>
        <SidebarLink href="#usage">使用指南</SidebarLink>
        <SidebarLink badge={<span className="badge text-bg-primary">New</span>} href="#faq">
          常见问题
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
    <SidebarDivider />
    <SidebarGroup>
      <SidebarGroupLabel>关于</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarLink href="#about" icon={<BookIcon />}>
          关于我们
        </SidebarLink>
        <SidebarLink href="#contact" icon={<UserIcon />}>
          联系方式
        </SidebarLink>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarBody>
</Sidebar>
```
