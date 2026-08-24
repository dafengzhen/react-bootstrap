```tsx
<>
  <Accordion
    activeKey={activeKey}
    id="accordion-controlled-demo"
    onSelect={(key) => {
      if (key == null) {
        return;
      }
      setActiveKey((prev) => {
        const next = String(key);
        return prev === next ? null : next;
      });
    }}
  >
    <AccordionItem eventKey="0">
      <AccordionHeader>受控条目 #1</AccordionHeader>
      <AccordionBody>展开状态完全由外部 state 控制，onSelect 在每次点击时触发。</AccordionBody>
    </AccordionItem>
    <AccordionItem eventKey="1">
      <AccordionHeader>受控条目 #2</AccordionHeader>
      <AccordionBody>
        通过 onSelect 维护 state，可以自行决定点击后是展开、折叠还是切换。
      </AccordionBody>
    </AccordionItem>
    <AccordionItem eventKey="2">
      <AccordionHeader>受控条目 #3</AccordionHeader>
      <AccordionBody>当前激活的 key：{activeKey ?? '无'}。</AccordionBody>
    </AccordionItem>
  </Accordion>

  <Accordion
    activeKey={activeKeys}
    alwaysOpen
    className="mt-3"
    id="accordion-controlled-always-demo"
    onSelect={(key) => {
      if (key == null) {
        return;
      }
      setActiveKeys((prev) => {
        const next = String(key);
        return prev.includes(next) ? prev.filter((k) => k !== next) : [...prev, next];
      });
    }}
  >
    <AccordionItem eventKey="a">
      <AccordionHeader>数组受控 A</AccordionHeader>
      <AccordionBody>
        alwaysOpen 模式下 activeKey 传入数组，onSelect 返回被点击条目的 key。
      </AccordionBody>
    </AccordionItem>
    <AccordionItem eventKey="b">
      <AccordionHeader>数组受控 B</AccordionHeader>
      <AccordionBody>当前展开的 key：{activeKeys.join('、') || '无'}。</AccordionBody>
    </AccordionItem>
  </Accordion>
</>
```
