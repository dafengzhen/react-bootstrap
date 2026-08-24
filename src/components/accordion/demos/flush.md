```tsx
<Accordion defaultActiveKey="0" flush id="accordion-flush-demo">
  <AccordionItem eventKey="0">
    <AccordionHeader>去边框条目 #1</AccordionHeader>
    <AccordionBody>flush 会移除外层边框与圆角，条目直接贴合父容器边缘。</AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="1">
    <AccordionHeader>去边框条目 #2</AccordionHeader>
    <AccordionBody>配合父容器已有的边框或圆角使用时，flush 模式能避免重复的边框线。</AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="2">
    <AccordionHeader>去边框条目 #3</AccordionHeader>
    <AccordionBody>内部条目之间仍保留分隔边框，仅最外层边框被移除。</AccordionBody>
  </AccordionItem>
</Accordion>
```
