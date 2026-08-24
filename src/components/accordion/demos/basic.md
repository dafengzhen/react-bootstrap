```tsx
<Accordion defaultActiveKey="0" id="accordion-basic-demo">
  <AccordionItem eventKey="0">
    <AccordionHeader>手风琴条目 #1</AccordionHeader>
    <AccordionBody>
      <strong>这是第一个条目的正文。</strong>{' '}
      默认展开，点击标题可再次折叠，同一时刻仅允许一个条目处于展开状态。
    </AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="1">
    <AccordionHeader>手风琴条目 #2</AccordionHeader>
    <AccordionBody>第二个条目的内容，点击标题后展开，同时第一个条目自动折叠。</AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="2">
    <AccordionHeader>手风琴条目 #3</AccordionHeader>
    <AccordionBody>
      第三个条目的内容。设置 id 后，按钮与折叠面板自动生成相互关联的 ARIA 属性，无需 Bootstrap JS。
    </AccordionBody>
  </AccordionItem>
</Accordion>
```
