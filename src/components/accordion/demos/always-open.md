```tsx
<Accordion alwaysOpen defaultActiveKey={['0', '1']} id="accordion-always-open-demo">
  <AccordionItem eventKey="0">
    <AccordionHeader>条目 #1（初始展开）</AccordionHeader>
    <AccordionBody>
      alwaysOpen 模式下多个条目可以同时展开，点击已展开的条目会单独折叠它，不影响其他条目。
    </AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="1">
    <AccordionHeader>条目 #2（初始展开）</AccordionHeader>
    <AccordionBody>defaultActiveKey 传入数组即可同时初始化多个展开的条目。</AccordionBody>
  </AccordionItem>
  <AccordionItem eventKey="2">
    <AccordionHeader>条目 #3</AccordionHeader>
    <AccordionBody>点击该条目时，前两个条目保持展开状态不变。</AccordionBody>
  </AccordionItem>
</Accordion>
```
