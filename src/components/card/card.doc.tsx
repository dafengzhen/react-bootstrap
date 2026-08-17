import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import bodyCode from './demos/body.md?raw';
import gridCode from './demos/grid.md?raw';
import groupCode from './demos/group.md?raw';
import headerFooterCode from './demos/header-footer.md?raw';
import horizontalCode from './demos/horizontal.md?raw';
import imageOverlayCode from './demos/image-overlay.md?raw';
import imagesCode from './demos/images.md?raw';
import kitchenSinkCode from './demos/kitchen-sink.md?raw';
import listGroupCode from './demos/list-group.md?raw';
import navHeaderCode from './demos/nav-header.md?raw';
import stylesBgCode from './demos/styles-bg.md?raw';
import stylesBorderCode from './demos/styles-border.md?raw';
import stylesTextCode from './demos/styles-text.md?raw';
import titlesCode from './demos/titles.md?raw';
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  CardImg,
  CardImgOverlay,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle,
} from './index';
import cardColorTypeCode from './types/card-color.md?raw';
import cardContentPropsTypeCode from './types/card-content-props.md?raw';
import cardImgPropsTypeCode from './types/card-img-props.md?raw';
import cardImgVariantTypeCode from './types/card-img-variant.md?raw';
import cardLinkPropsTypeCode from './types/card-link-props.md?raw';
import cardPanelPropsTypeCode from './types/card-panel-props.md?raw';
import cardPropsTypeCode from './types/card-props.md?raw';
import cardTextColorTypeCode from './types/card-text-color.md?raw';

const cardProps: ApiProp[] = [
  {
    defaultValue: '-',
    description: 'Card：设置卡片背景色，渲染为 `bg-*` 类',
    name: 'bg',
    type: 'CardColor',
  },
  {
    defaultValue: 'false',
    description: 'Card：为 `true` 时自动将子元素包裹在 `CardBody` 中',
    name: 'body',
    type: 'boolean',
  },
  {
    defaultValue: '-',
    description: 'Card：设置卡片边框颜色，渲染为 `border-*` 类',
    name: 'border',
    type: 'CardColor',
  },
  {
    defaultValue: '-',
    description: 'Card：设置卡片文字颜色，渲染为 `text-*` 类',
    name: 'text',
    type: 'CardTextColor',
  },
  {
    defaultValue: "'card-img'",
    description:
      'CardImg：图片位置，`top` 置于卡片顶部、`bottom` 置于卡片底部，不设置则使用 `card-img` 类',
    name: 'variant',
    type: 'CardImgVariant',
  },
  {
    defaultValue: "'#'",
    description: 'CardLink：链接地址',
    name: 'href',
    type: 'string',
  },
  {
    defaultValue: '-',
    description:
      '所有组件：卡片内容，CardTitle 渲染为 `div.card-title.h5`，CardSubtitle 渲染为 `div.card-subtitle.h6`',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '所有组件：自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description:
      '透传原生元素属性：Card 及分区组件为 `HTMLAttributes`，CardImg 为 `ImgHTMLAttributes`（如 `src`、`alt`），CardLink 为 `AnchorHTMLAttributes`',
    name: '...rest',
    type: 'HTMLAttributes | ImgHTMLAttributes | AnchorHTMLAttributes',
  },
];

const cardTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: cardColorTypeCode,
    description: '卡片背景色与边框色类型',
    name: 'CardColor',
  },
  {
    code: cardTextColorTypeCode,
    description: '卡片文字颜色类型',
    name: 'CardTextColor',
  },
  {
    code: cardImgVariantTypeCode,
    description: '卡片图片位置类型',
    name: 'CardImgVariant',
  },
  {
    code: cardPropsTypeCode,
    description: '卡片组件属性接口',
    name: 'CardProps',
  },
  {
    code: cardImgPropsTypeCode,
    description: '卡片图片组件属性接口',
    name: 'CardImgProps',
  },
  {
    code: cardLinkPropsTypeCode,
    description: '卡片链接组件属性接口',
    name: 'CardLinkProps',
  },
  {
    code: cardContentPropsTypeCode,
    description: '卡片内容分区组件属性接口（CardBody、CardTitle、CardSubtitle、CardText）',
    name: 'CardContentProps',
  },
  {
    code: cardPanelPropsTypeCode,
    description: '卡片面板组件属性接口（CardImgOverlay、CardHeader、CardFooter、CardGroup）',
    name: 'CardPanelProps',
  },
];

export const CardDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础卡片">
        <Card style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>卡片标题</CardTitle>
            <CardText>这是一段示例文本，用于展示卡片的基本结构：卡片、主体、标题与正文。</CardText>
            <Button variant="primary">前往某处</Button>
          </CardBody>
        </Card>
      </DemoSection>

      <DemoSection code={bodyCode} title="卡片主体">
        <Card body style={{ width: '18rem' }}>
          <CardTitle>使用 body 属性</CardTitle>
          <CardText>
            开启 <code>body</code> 属性后，子元素会自动包裹在 <code>CardBody</code> 中。
          </CardText>
        </Card>
      </DemoSection>

      <DemoSection code={titlesCode} title="标题、文本与链接">
        <Card style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>卡片标题</CardTitle>
            <CardSubtitle className="mb-2 text-body-secondary">卡片副标题</CardSubtitle>
            <CardText>这是一段示例文本，展示标题、副标题、正文与链接的组合方式。</CardText>
            <CardLink href="#">卡片链接</CardLink>
            <CardLink href="#">另一个链接</CardLink>
          </CardBody>
        </Card>
      </DemoSection>

      <DemoSection code={imagesCode} title="图片">
        <div className="d-flex flex-wrap gap-3">
          <Card style={{ width: '18rem' }}>
            <CardImg alt="顶部图片占位图" src="/card-placeholder-top.svg" variant="top" />
            <CardBody>
              <CardTitle>顶部图片</CardTitle>
              <CardText>
                使用 <code>variant="top"</code> 将图片置于卡片顶部，并自动匹配卡片圆角。
              </CardText>
            </CardBody>
          </Card>
          <Card style={{ width: '18rem' }}>
            <CardBody>
              <CardTitle>底部图片</CardTitle>
              <CardText>
                使用 <code>variant="bottom"</code> 将图片置于卡片底部。
              </CardText>
            </CardBody>
            <CardImg alt="底部图片占位图" src="/card-placeholder-top.svg" variant="bottom" />
          </Card>
        </div>
      </DemoSection>

      <DemoSection code={imageOverlayCode} title="图片覆盖">
        <Card className="text-bg-dark" style={{ width: '18rem' }}>
          <CardImg alt="覆盖底图" src="/card-placeholder-overlay.svg" />
          <CardImgOverlay>
            <CardTitle>图片覆盖标题</CardTitle>
            <CardText>文字直接叠加在图片上方，适合深色背景的图片。</CardText>
            <CardText>
              <small>最后更新于 3 分钟前</small>
            </CardText>
          </CardImgOverlay>
        </Card>
      </DemoSection>

      <DemoSection code={horizontalCode} title="横向卡片">
        <Card className="mb-3" style={{ maxWidth: '540px' }}>
          <div className="row g-0">
            <div className="col-md-4">
              <CardImg
                alt="横向图片占位图"
                className="img-fluid rounded-start"
                src="/card-placeholder-horizontal.svg"
              />
            </div>
            <div className="col-md-8">
              <CardBody>
                <CardTitle>横向卡片</CardTitle>
                <CardText>配合网格工具类，图片与内容并排展示，适合中大型宽度布局。</CardText>
                <CardText>
                  <small className="text-body-secondary">最后更新于 3 分钟前</small>
                </CardText>
              </CardBody>
            </div>
          </div>
        </Card>
      </DemoSection>

      <DemoSection code={headerFooterCode} title="页眉与页脚">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <Card className="text-center" style={{ width: '18rem' }}>
            <CardHeader>特色</CardHeader>
            <CardBody>
              <CardTitle>特殊标题处理</CardTitle>
              <CardText>使用页眉与页脚扩展卡片内容，页脚常用于展示次要信息。</CardText>
              <Button variant="primary">前往某处</Button>
            </CardBody>
            <CardFooter className="text-body-secondary">2 天前</CardFooter>
          </Card>
          <Card className="text-center" style={{ width: '18rem' }}>
            <CardHeader>
              <h5 className="mb-0">引用</h5>
            </CardHeader>
            <CardBody>
              <blockquote className="blockquote mb-0">
                <p>一个被版面分散注意力的读者，将无法专注于排版本身。</p>
                <footer className="blockquote-footer">
                  出自 <cite title="来源标题">某位名人</cite>
                </footer>
              </blockquote>
            </CardBody>
          </Card>
        </div>
      </DemoSection>

      <DemoSection code={navHeaderCode} title="页眉导航">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <Card className="text-center" style={{ width: '18rem' }}>
            <CardHeader>
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a aria-current="page" className="nav-link active" href="#card-tabs-demo">
                    激活
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#card-tabs-demo">
                    链接
                  </a>
                </li>
                <li className="nav-item">
                  <a aria-disabled="true" className="nav-link disabled" href="#card-tabs-demo">
                    禁用
                  </a>
                </li>
              </ul>
            </CardHeader>
            <CardBody>
              <CardTitle>页眉中的标签导航</CardTitle>
              <CardText>通过 card-header-tabs 类让导航与页眉无缝衔接。</CardText>
            </CardBody>
          </Card>
          <Card className="text-center" style={{ width: '18rem' }}>
            <CardHeader>
              <ul className="nav nav-pills card-header-pills">
                <li className="nav-item">
                  <a aria-current="page" className="nav-link active" href="#card-pills-demo">
                    激活
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#card-pills-demo">
                    链接
                  </a>
                </li>
                <li className="nav-item">
                  <a aria-disabled="true" className="nav-link disabled" href="#card-pills-demo">
                    禁用
                  </a>
                </li>
              </ul>
            </CardHeader>
            <CardBody>
              <CardTitle>页眉中的胶囊导航</CardTitle>
              <CardText>使用 card-header-pills 类将胶囊导航嵌入页眉。</CardText>
            </CardBody>
          </Card>
        </div>
      </DemoSection>

      <DemoSection code={listGroupCode} title="列表组">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <Card style={{ width: '18rem' }}>
            <CardHeader>列表组</CardHeader>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">列表项 1</li>
              <li className="list-group-item">列表项 2</li>
              <li className="list-group-item">列表项 3</li>
            </ul>
          </Card>
          <Card style={{ width: '18rem' }}>
            <ul className="list-group list-group-flush">
              <li aria-current="true" className="list-group-item active">
                激活的列表项
              </li>
              <li className="list-group-item">普通列表项</li>
              <li className="list-group-item disabled">禁用的列表项</li>
            </ul>
          </Card>
        </div>
      </DemoSection>

      <DemoSection code={kitchenSinkCode} title="组合示例">
        <Card style={{ width: '18rem' }}>
          <CardImg alt="顶部图片占位图" src="/card-placeholder-top.svg" variant="top" />
          <CardBody>
            <CardTitle>组合示例</CardTitle>
            <CardText>将图片、正文、列表组、链接与页脚组合为一张完整卡片。</CardText>
          </CardBody>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">列表项 1</li>
            <li className="list-group-item">列表项 2</li>
            <li className="list-group-item">列表项 3</li>
          </ul>
          <CardBody>
            <CardLink href="#">卡片链接</CardLink>
            <CardLink href="#">另一个链接</CardLink>
          </CardBody>
          <CardFooter className="text-body-secondary">2 天前</CardFooter>
        </Card>
      </DemoSection>

      <DemoSection code={stylesBgCode} title="背景与文字颜色">
        <div className="row g-3">
          <div className="col-md-4">
            <Card bg="primary" text="white">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>主要样式</CardTitle>
                <CardText>
                  使用 <code>bg</code> 与 <code>text</code> 属性快速设置卡片配色。
                </CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-4">
            <Card bg="success" text="white">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>成功样式</CardTitle>
                <CardText>背景色与文字颜色均可通过属性单独控制。</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-4">
            <Card bg="danger" text="white">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>危险样式</CardTitle>
                <CardText>
                  也可以直接传入 <code>className="text-bg-danger"</code> 等工具类。
                </CardText>
              </CardBody>
            </Card>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={stylesBorderCode} title="边框颜色">
        <div className="row g-3">
          <div className="col-sm-6">
            <Card border="primary">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>主要边框</CardTitle>
                <CardText>
                  使用 <code>border</code> 属性为卡片设置主题色边框。
                </CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-6">
            <Card border="success">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>成功边框</CardTitle>
                <CardText>边框颜色独立于背景色，可以自由组合。</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-6">
            <Card border="danger">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>危险边框</CardTitle>
                <CardText>边框仅改变描边颜色，不影响卡片内部样式。</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-6">
            <Card border="warning">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>警告边框</CardTitle>
                <CardText>支持 Bootstrap 的全部主题色。</CardText>
              </CardBody>
            </Card>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={stylesTextCode} title="文字颜色">
        <div className="row g-3">
          <div className="col-sm-6">
            <Card border="primary" style={{ maxWidth: '18rem' }} text="primary">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>主要文字</CardTitle>
                <CardText>
                  使用 <code>text</code> 属性单独设置文字颜色，并可搭配边框。
                </CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-6">
            <Card border="danger" style={{ maxWidth: '18rem' }} text="danger">
              <CardHeader>页眉</CardHeader>
              <CardBody>
                <CardTitle>危险文字</CardTitle>
                <CardText>文字颜色同样支持全部主题色以及 white、muted 等。</CardText>
              </CardBody>
            </Card>
          </div>
        </div>
      </DemoSection>

      <DemoSection code={gridCode} title="网格布局">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {['主要', '次要', '成功'].map((title) => (
            <div className="col" key={title}>
              <Card className="h-100">
                <CardBody>
                  <CardTitle>{title}卡片</CardTitle>
                  <CardText>使用网格系统让卡片等宽排列，并为多张卡片提供统一间距。</CardText>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection code={groupCode} title="卡片组">
        <CardGroup>
          <Card>
            <CardBody>
              <CardTitle>卡片组标题 1</CardTitle>
              <CardText>卡片组将卡片并排展示，并让它们等高对齐、无间距相连。</CardText>
            </CardBody>
            <CardFooter>
              <small className="text-body-secondary">页脚内容同样对齐</small>
            </CardFooter>
          </Card>
          <Card>
            <CardBody>
              <CardTitle>卡片组标题 2</CardTitle>
              <CardText>当内容高度不一致时，同一组内的卡片自动等高。</CardText>
            </CardBody>
            <CardFooter>
              <small className="text-body-secondary">页脚内容同样对齐</small>
            </CardFooter>
          </Card>
          <Card>
            <CardBody>
              <CardTitle>卡片组标题 3</CardTitle>
              <CardText>适合展示内容量相近的并列信息，例如对比或分类。</CardText>
            </CardBody>
            <CardFooter>
              <small className="text-body-secondary">页脚内容同样对齐</small>
            </CardFooter>
          </Card>
        </CardGroup>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的卡片组件，提供灵活且可扩展的内容容器，支持页眉页脚、图片、覆盖层、导航与多种配色样式"
      componentName="Card"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={cardProps}
      typeDefinitions={cardTypeDefinitions}
    />
  );
};

export default CardDoc;
