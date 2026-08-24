```tsx
const CustomToggle = ({ children, eventKey }: { children: ReactNode; eventKey: string }) => {
  const buttonProps = useAccordionButton(eventKey);

  return (
    <button className="btn btn-outline-primary btn-sm" type="button" {...buttonProps}>
      {children}
    </button>
  );
};

<Accordion defaultActiveKey="0" id="accordion-custom-demo">
  <AccordionItem eventKey="0">
    <h2 className="accordion-header d-flex gap-2">
      <CustomToggle eventKey="0">自定义触发器</CustomToggle>
      <Badge bg="primary" className="align-self-center" pill>
        3 个条目
      </Badge>
    </h2>
    <AccordionCollapse eventKey="0">
      <div className="card card-body">
        useAccordionButton 返回 aria-expanded 与 aria-controls 等按钮属性，配合 AccordionCollapse
        即可组合出任意结构的触发器。
      </div>
    </AccordionCollapse>
  </AccordionItem>
  <AccordionItem eventKey="1">
    <AccordionHeader as="div">标题标签可替换</AccordionHeader>
    <AccordionBody>
      AccordionHeader 的 as 属性可以替换标题标签，内部仍自动渲染带上下文的 AccordionButton。
    </AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="2">
    <AccordionHeader>带标记的标题</AccordionHeader>
    <AccordionBody>
      AccordionHeader 的子内容直接渲染在 accordion-button 内，可以放置徽标、图标等任意内容。
    </AccordionBody>
  </AccordionItem>
</Accordion>;
```
