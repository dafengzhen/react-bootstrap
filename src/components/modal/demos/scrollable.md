```tsx
<>
  <Button onClick={() => setScrollableOpen(true)} variant="primary">
    打开滚动长内容模态框
  </Button>

  <Modal isOpen={scrollableOpen} onOpenChange={setScrollableOpen} scrollable>
    <ModalHeader closeButton>
      <ModalTitle>滚动长内容</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <p>scrollable 为 true 时，正文区域出现滚动条，页眉与页脚保持固定。</p>
      {Array.from({ length: 12 }, (_, index) => (
        <p key={index}>
          第 {index + 1}{' '}
          段内容。这是用于演示滚动行为的占位文本，内容足够长时会激活正文区域的滚动条。
        </p>
      ))}
    </ModalBody>
    <ModalFooter>
      <Button onClick={() => setScrollableOpen(false)} variant="secondary">
        关闭
      </Button>
      <Button onClick={() => setScrollableOpen(false)} variant="primary">
        了解
      </Button>
    </ModalFooter>
  </Modal>
</>
```
