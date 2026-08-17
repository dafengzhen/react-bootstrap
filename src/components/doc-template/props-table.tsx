import { type FC, type MouseEvent as ReactMouseEvent } from 'react';

import type { ApiProp } from './types';

export interface PropsTableProps {
  onTypeClick: (event: ReactMouseEvent<HTMLAnchorElement>, typeName: string) => void;
  props: ApiProp[];

  typeDefIds: ReadonlyMap<string, string>;
}

export const PropsTable: FC<PropsTableProps> = ({ onTypeClick, props, typeDefIds }) => (
  <div className="table-responsive">
    <table className="table table-bordered table-hover props-table">
      <thead className="table-light">
        <tr>
          <th>属性名</th>
          <th>类型</th>
          <th>默认值</th>
          <th>描述</th>
        </tr>
      </thead>
      <tbody>
        {props.map((prop) => (
          <tr key={prop.name}>
            <td>
              <code className="text-primary">{prop.name}</code>
            </td>
            <td>
              {typeDefIds.has(prop.type) ? (
                <a
                  className="prop-type-link"
                  href={`#${typeDefIds.get(prop.type)}`}
                  onClick={(event) => onTypeClick(event, prop.type)}
                  title={`查看类型定义：${prop.type}`}
                >
                  <code className="text-success">{prop.type}</code>
                </a>
              ) : (
                <code className="text-success">{prop.type}</code>
              )}
            </td>
            <td>
              {prop.defaultValue && prop.defaultValue !== '-' ? (
                <code className="prop-default-value">{prop.defaultValue}</code>
              ) : (
                <span className="text-muted">-</span>
              )}
            </td>
            <td>{prop.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PropsTable;
