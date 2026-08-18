```tsx
<Alert dismissible onClose={handleLiveClose} show={showLive} variant="warning">
  <strong>注意！</strong> 这是一条可以通过关闭按钮隐藏的警告消息。
</Alert>;
{
  !showLive && (
    <Button onClick={handleLiveShow} variant="outline-primary">
      重新显示警告框
    </Button>
  );
}
```
