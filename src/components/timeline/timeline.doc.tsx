import { Card, CardBody, CardText, CardTitle } from '../card';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import alternateCode from './demos/alternate.md?raw';
import basicCode from './demos/basic.md?raw';
import colorsCode from './demos/colors.md?raw';
import customDotCode from './demos/custom-dot.md?raw';
import richCode from './demos/rich.md?raw';
import rightCode from './demos/right.md?raw';
import { Timeline } from './timeline';
import { TimelineItem } from './timeline-item';
import timelineAlignTypeCode from './types/timeline-align.md?raw';
import timelineColorTypeCode from './types/timeline-color.md?raw';
import timelineContextValueTypeCode from './types/timeline-context-value.md?raw';
import timelineItemPropsTypeCode from './types/timeline-item-props.md?raw';
import timelinePropsTypeCode from './types/timeline-props.md?raw';

const timelineProps: ApiProp[] = [
  {
    component: 'Timeline',
    defaultValue: "'left'",
    description:
      '时间轴布局方向，`left` 节点靠左、`right` 节点靠右、`alternate` 节点左右交替；交替布局在窄屏下自动回退为靠左',
    name: 'align',
    type: 'TimelineAlign',
  },
  {
    component: 'Timeline',
    defaultValue: "'ol'",
    description: '根列表渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Timeline',
    defaultValue: '-',
    description: '时间轴内容，仅识别 `TimelineItem`，其余子项会被忽略',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Timeline',
    defaultValue: '-',
    description: '自定义类名，作用于根列表',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Timeline',
    defaultValue: "'primary'",
    description: '默认节点颜色，可被单个条目的 `color` 覆盖',
    name: 'color',
    type: 'TimelineColor',
  },
  {
    component: 'Timeline',
    defaultValue: '-',
    description: '根列表的所有原生属性（如 `style`、`aria-label` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'TimelineItem',
    defaultValue: "'li'",
    description: '列表项渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '条目额外内容，渲染在描述之后',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '自定义类名，作用于列表项',
    name: 'className',
    type: 'string',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '节点颜色，覆盖 `Timeline` 上的 `color`',
    name: 'color',
    type: 'TimelineColor',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '条目描述内容',
    name: 'description',
    type: 'ReactNode',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '自定义节点内容，替代默认圆点',
    name: 'dot',
    type: 'ReactNode',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '条目序号，由 `Timeline` 自动注入，用于交替布局的左右分配',
    name: 'index',
    type: 'number',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '时间戳，渲染在标题之前；`alternate` 布局下渲染在内容另一侧',
    name: 'time',
    type: 'ReactNode',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '条目标题内容',
    name: 'title',
    type: 'ReactNode',
  },
  {
    component: 'TimelineItem',
    defaultValue: '-',
    description: '列表项的所有原生属性（如 `style`、`onClick` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const timelineTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: timelineAlignTypeCode,
    description: '时间轴布局方向类型',
    name: 'TimelineAlign',
  },
  {
    code: timelineColorTypeCode,
    description: '节点颜色类型，对应 Bootstrap 语义色',
    name: 'TimelineColor',
  },
  {
    code: timelineContextValueTypeCode,
    description: '时间轴上下文值，可通过 `useTimeline` 获取（不在 `Timeline` 内返回 `null`）',
    name: 'TimelineContextValue',
  },
  {
    code: timelineItemPropsTypeCode,
    description: '时间轴条目组件属性接口',
    name: 'TimelineItemProps',
  },
  {
    code: timelinePropsTypeCode,
    description: '时间轴组件属性接口',
    name: 'TimelineProps',
  },
];

export const TimelineDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Timeline>
          <TimelineItem description="提交订单，等待支付" time="09:30" title="创建订单" />
          <TimelineItem description="支付成功，订单进入备货" time="09:42" title="支付成功" />
          <TimelineItem description="商品已出库，交由快递揽收" time="10:15" title="仓库发货" />
          <TimelineItem description="订单已签收，交易完成" time="次日 14:20" title="确认收货" />
        </Timeline>
        <p className="mb-0 mt-3 text-muted small">
          默认 align 为 left，连接线与节点靠左，time 渲染在标题之前；最后一条不会继续向下绘制连接线
        </p>
      </DemoSection>

      <DemoSection code={rightCode} title="右侧布局">
        <Timeline align="right">
          <TimelineItem description="提交订单，等待支付" time="09:30" title="创建订单" />
          <TimelineItem description="支付成功，订单进入备货" time="09:42" title="支付成功" />
          <TimelineItem description="商品已出库，交由快递揽收" time="10:15" title="仓库发货" />
          <TimelineItem description="订单已签收，交易完成" time="次日 14:20" title="确认收货" />
        </Timeline>
        <p className="mb-0 mt-3 text-muted small">
          align 设为 right 时节点与连接线整体靠右，内容从右侧向左侧排列
        </p>
      </DemoSection>

      <DemoSection code={alternateCode} title="交替布局">
        <Timeline align="alternate">
          <TimelineItem description="提交订单，等待支付" time="09:30" title="创建订单" />
          <TimelineItem description="支付成功，订单进入备货" time="09:42" title="支付成功" />
          <TimelineItem description="商品已出库，交由快递揽收" time="10:15" title="仓库发货" />
          <TimelineItem description="订单已签收，交易完成" time="次日 14:20" title="确认收货" />
        </Timeline>
        <p className="mb-0 mt-3 text-muted small">
          align 设为 alternate 时条目沿中轴线左右交替，time
          渲染在内容另一侧；窄屏下自动回退为靠左布局
        </p>
      </DemoSection>

      <DemoSection code={colorsCode} title="节点颜色">
        <Timeline>
          <TimelineItem color="success" description="所有用例均已通过" title="构建成功" />
          <TimelineItem color="info" description="等待人工审核" title="提交审核" />
          <TimelineItem color="warning" description="缺少负责人信息，请补充" title="信息不完整" />
          <TimelineItem color="danger" description="部署失败，已自动回滚" title="发布失败" />
        </Timeline>
        <Timeline className="mt-4" color="secondary">
          <TimelineItem description="继承 Timeline 上设置的节点颜色" title="默认节点颜色" />
          <TimelineItem description="同样继承 Timeline 上设置的节点颜色" title="默认节点颜色" />
        </Timeline>
        <p className="mb-0 mt-3 text-muted small">
          color 支持 Bootstrap 全部语义色；条目上的 color 优先级高于 Timeline，未设置的条目继承
          Timeline 的 color
        </p>
      </DemoSection>

      <DemoSection code={customDotCode} title="自定义节点">
        <Timeline>
          <TimelineItem description="填写并提交报名表" dot={<span>📝</span>} title="提交报名" />
          <TimelineItem
            description="审核通过，缴纳参赛费用"
            dot={<span>💰</span>}
            title="缴纳费用"
          />
          <TimelineItem description="现场签到，领取参赛包" dot={<span>🏁</span>} title="赛前签到" />
          <TimelineItem
            description="完成比赛，领取完赛奖牌"
            dot={<span>🏅</span>}
            title="完赛领奖"
          />
        </Timeline>
        <p className="mb-0 mt-3 text-muted small">
          通过 dot 传入任意内容即可替换默认圆点，自定义节点始终居中于连接线
        </p>
      </DemoSection>

      <DemoSection code={richCode} title="自定义内容">
        <Timeline>
          <TimelineItem description="创建发布计划" time="10:00" title="发布公告">
            <Card className="mb-0 mt-1">
              <CardBody>
                <CardTitle>v1.2.0 版本发布说明</CardTitle>
                <CardText>新增 Timeline 时间轴组件，支持三种布局与自定义节点。</CardText>
              </CardBody>
            </Card>
          </TimelineItem>
          <TimelineItem description="完成回归测试" time="14:00" title="全量测试" />
          <TimelineItem description="同步至所有生产节点" time="16:30" title="灰度发布" />
        </Timeline>
        <p className="mb-0 mt-3 text-muted small">
          children 渲染在描述之后，可放入卡片、按钮等任意内容；连接线会随条目高度自动延伸
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的时间轴组件，用于按时间顺序展示事件与动态，支持左/右/交替三种布局、语义色节点、自定义节点、时间戳与任意条目内容，交替布局在窄屏下自动回退为靠左"
      componentName="Timeline"
      componentTags={['基础', '反馈']}
      demoContent={demoContent}
      props={timelineProps}
      typeDefinitions={timelineTypeDefinitions}
    />
  );
};

export default TimelineDoc;
