import { Fragment, useState } from 'react';

import type { TableEditOption, TableEditValue } from './types';

import {
  type ApiProp,
  type ApiTypeDefinition,
  DemoSection,
  DocTemplate,
} from '../../internal/doc-template';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { FormControl } from '../form-control';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../modal';
import { Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from '../offcanvas';
import activeCode from './demos/active.md?raw';
import addRowCode from './demos/add-row.md?raw';
import anatomyCode from './demos/anatomy.md?raw';
import basicCode from './demos/basic.md?raw';
import borderedCode from './demos/bordered.md?raw';
import borderlessCode from './demos/borderless.md?raw';
import captionTopCode from './demos/caption-top.md?raw';
import crudCode from './demos/crud.md?raw';
import deleteRowCode from './demos/delete-row.md?raw';
import detailDrawerCode from './demos/detail-drawer.md?raw';
import detailModalCode from './demos/detail-modal.md?raw';
import emptyCode from './demos/empty.md?raw';
import expandableCode from './demos/expandable.md?raw';
import groupDividersCode from './demos/group-dividers.md?raw';
import hoverCode from './demos/hover.md?raw';
import inlineEditCode from './demos/inline-edit.md?raw';
import loadingCode from './demos/loading.md?raw';
import masterDetailCode from './demos/master-detail.md?raw';
import nestingCode from './demos/nesting.md?raw';
import responsiveCode from './demos/responsive.md?raw';
import selectionCode from './demos/selection.md?raw';
import smallCode from './demos/small.md?raw';
import stripedColumnsCode from './demos/striped-columns.md?raw';
import stripedCode from './demos/striped.md?raw';
import variantsCode from './demos/variants.md?raw';
import verticalAlignmentCode from './demos/vertical-alignment.md?raw';
import viewToggleCode from './demos/view-toggle.md?raw';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableDetailRow,
  TableEditCell,
  TableEmpty,
  TableExpandCell,
  TableFooter,
  TableHead,
  TableLoading,
  TableResponsive,
  TableRow,
  TableSelectCell,
  useTable,
  useTableEditing,
  useTableExpansion,
  useTableSelection,
} from './index';
import tableAlignTypeCode from './types/table-align.md?raw';
import tableBreakpointTypeCode from './types/table-breakpoint.md?raw';
import tableCaptionPropsTypeCode from './types/table-caption-props.md?raw';
import tableCellPropsTypeCode from './types/table-cell-props.md?raw';
import tableCellScopeTypeCode from './types/table-cell-scope.md?raw';
import tableDetailRowPropsTypeCode from './types/table-detail-row-props.md?raw';
import tableEditCellPropsTypeCode from './types/table-edit-cell-props.md?raw';
import tableEditOptionTypeCode from './types/table-edit-option.md?raw';
import tableEditTypeTypeCode from './types/table-edit-type.md?raw';
import tableEditValueTypeCode from './types/table-edit-value.md?raw';
import tableEmptyPropsTypeCode from './types/table-empty-props.md?raw';
import tableExpandCellPropsTypeCode from './types/table-expand-cell-props.md?raw';
import tableLoadingPropsTypeCode from './types/table-loading-props.md?raw';
import tablePropsTypeCode from './types/table-props.md?raw';
import tableResponsivePropsTypeCode from './types/table-responsive-props.md?raw';
import tableRowPropsTypeCode from './types/table-row-props.md?raw';
import tableSectionPropsTypeCode from './types/table-section-props.md?raw';
import tableSelectCellPropsTypeCode from './types/table-select-cell-props.md?raw';
import tableSizeTypeCode from './types/table-size.md?raw';
import tableStripedTypeCode from './types/table-striped.md?raw';
import tableVariantTypeCode from './types/table-variant.md?raw';
import useTableEditingOptionsTypeCode from './types/use-table-editing-options.md?raw';
import useTableEditingResultTypeCode from './types/use-table-editing-result.md?raw';
import useTableExpansionOptionsTypeCode from './types/use-table-expansion-options.md?raw';
import useTableExpansionResultTypeCode from './types/use-table-expansion-result.md?raw';
import useTableOptionsTypeCode from './types/use-table-options.md?raw';
import useTableResultTypeCode from './types/use-table-result.md?raw';
import useTableSelectionOptionsTypeCode from './types/use-table-selection-options.md?raw';
import useTableSelectionResultTypeCode from './types/use-table-selection-result.md?raw';

interface DocUser {
  firstName: string;
  id: number;
  lastName: string;
  note: string;
  status: string;
  username: string;
}

const DOC_USERS: DocUser[] = [
  {
    firstName: '张',
    id: 1,
    lastName: '伟',
    note: '核心成员',
    status: '在线',
    username: '@zhangwei',
  },
  { firstName: '李', id: 2, lastName: '磊', note: '新加入', status: '离线', username: '@lilei' },
  { firstName: '王', id: 3, lastName: '芳', note: '管理员', status: '忙碌', username: '@wangfang' },
];

const STATUS_OPTIONS: TableEditOption[] = [
  { label: '在线', value: '在线' },
  { label: '离线', value: '离线' },
  { label: '忙碌', value: '忙碌' },
];

const requiredValidator = (value: TableEditValue) =>
  String(value).trim() === '' ? '不能为空' : undefined;

interface DocOrder {
  address: string;
  amount: number;
  createdAt: string;
  customer: string;
  id: number;
  items: DocOrderItem[];
  no: string;
  note: string;
  status: string;
}

interface DocOrderItem {
  name: string;
  price: number;
  quantity: number;
}

const DOC_ORDERS: DocOrder[] = [
  {
    address: '北京市朝阳区望京街道 88 号',
    amount: 129.0,
    createdAt: '2025-01-12 10:24',
    customer: '张伟',
    id: 1,
    items: [
      { name: '机械键盘', price: 99, quantity: 1 },
      { name: '鼠标垫', price: 30, quantity: 1 },
    ],
    no: '202501120001',
    note: '请放前台代收',
    status: '已发货',
  },
  {
    address: '上海市浦东新区世纪大道 100 号',
    amount: 59.9,
    createdAt: '2025-01-12 14:08',
    customer: '李磊',
    id: 2,
    items: [{ name: '笔记本支架', price: 59.9, quantity: 1 }],
    no: '202501120002',
    note: '',
    status: '待发货',
  },
  {
    address: '广州市天河区珠江新城 12 号',
    amount: 358.5,
    createdAt: '2025-01-13 09:45',
    customer: '王芳',
    id: 3,
    items: [
      { name: '显示器挂灯', price: 199, quantity: 1 },
      { name: '集线器', price: 79.5, quantity: 2 },
    ],
    no: '202501130003',
    note: '工作日送达',
    status: '已完成',
  },
];

const ExpandableDemo = () => {
  const expansion = useTableExpansion<number>();
  const orderIds = DOC_ORDERS.map((order) => order.id);

  return (
    <>
      <div className="d-flex gap-2 mb-2">
        <Button onClick={() => expansion.expandAll(orderIds)} size="sm" variant="outline-primary">
          全部展开
        </Button>
        <Button onClick={expansion.collapseAll} size="sm" variant="outline-secondary">
          全部收起
        </Button>
      </div>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col" />
            <TableCell as="th" scope="col">
              订单号
            </TableCell>
            <TableCell as="th" scope="col">
              客户
            </TableCell>
            <TableCell as="th" scope="col">
              金额
            </TableCell>
            <TableCell as="th" scope="col">
              状态
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DOC_ORDERS.map((order) => (
            <Fragment key={order.id}>
              <TableRow>
                <TableExpandCell
                  collapseLabel={`收起订单 ${order.no}`}
                  expanded={expansion.isExpanded(order.id)}
                  expandLabel={`展开订单 ${order.no}`}
                  onToggle={() => expansion.toggle(order.id)}
                />
                <TableCell as="th" scope="row">
                  {order.no}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>¥{order.amount}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
              {expansion.isExpanded(order.id) && (
                <TableDetailRow colSpan={5}>
                  <div className="mb-2 row g-2">
                    <div className="col-md-6">
                      <strong>收货地址：</strong>
                      {order.address}
                    </div>
                    <div className="col-md-6">
                      <strong>下单时间：</strong>
                      {order.createdAt}
                    </div>
                    <div className="col-12">
                      <strong>备注：</strong>
                      {order.note || '无'}
                    </div>
                  </div>
                  <Table bordered size="sm">
                    <TableHead>
                      <TableRow>
                        <TableCell as="th" scope="col">
                          条目
                        </TableCell>
                        <TableCell as="th" scope="col">
                          数量
                        </TableCell>
                        <TableCell as="th" scope="col">
                          单价
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>¥{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableDetailRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const MasterDetailDemo = () => {
  const [detailId, setDetailId] = useState<number>(DOC_USERS[0].id);
  const detail = DOC_USERS.find((user) => user.id === detailId);

  return (
    <div className="row g-3">
      <div className="col-md-7">
        <Table hover>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DOC_USERS.map((user) => (
              <TableRow
                active={detailId === user.id}
                key={user.id}
                onClick={() => setDetailId(user.id)}
              >
                <TableCell as="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="col-md-5">
        <div className="card">
          <div className="card-header">用户详情</div>
          <div className="card-body">
            {detail && (
              <dl className="mb-0 row">
                <dt className="col-4">编号</dt>
                <dd className="col-8">{detail.id}</dd>
                <dt className="col-4">姓名</dt>
                <dd className="col-8">
                  {detail.lastName}
                  {detail.firstName}
                </dd>
                <dt className="col-4">用户名</dt>
                <dd className="col-8">{detail.username}</dd>
                <dt className="col-4">状态</dt>
                <dd className="col-8">{detail.status}</dd>
                <dt className="col-4">备注</dt>
                <dd className="col-8">{detail.note || '无'}</dd>
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailModalDemo = () => {
  const [detailId, setDetailId] = useState<number>();
  const detail = DOC_USERS.find((user) => user.id === detailId);

  return (
    <>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
            <TableCell as="th" scope="col">
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DOC_USERS.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Button onClick={() => setDetailId(user.id)} size="sm" variant="outline-primary">
                  查看
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={detailId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDetailId(undefined);
          }
        }}
      >
        <ModalHeader closeButton>
          <ModalTitle>用户详情</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {detail && (
            <Table bordered size="sm">
              <TableBody>
                <TableRow>
                  <TableCell as="th" scope="row">
                    编号
                  </TableCell>
                  <TableCell>{detail.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    姓名
                  </TableCell>
                  <TableCell>
                    {detail.lastName}
                    {detail.firstName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    用户名
                  </TableCell>
                  <TableCell>{detail.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    状态
                  </TableCell>
                  <TableCell>{detail.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    备注
                  </TableCell>
                  <TableCell>{detail.note || '无'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setDetailId(undefined)} variant="secondary">
            关闭
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const DetailDrawerDemo = () => {
  const [detailId, setDetailId] = useState<number>();
  const detail = DOC_USERS.find((user) => user.id === detailId);

  return (
    <>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
            <TableCell as="th" scope="col">
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DOC_USERS.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Button onClick={() => setDetailId(user.id)} size="sm" variant="outline-primary">
                  查看
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Offcanvas
        isOpen={detailId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDetailId(undefined);
          }
        }}
        placement="end"
      >
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>用户详情</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          {detail && (
            <dl className="mb-0 row">
              <dt className="col-4">编号</dt>
              <dd className="col-8">{detail.id}</dd>
              <dt className="col-4">姓名</dt>
              <dd className="col-8">
                {detail.lastName}
                {detail.firstName}
              </dd>
              <dt className="col-4">用户名</dt>
              <dd className="col-8">{detail.username}</dd>
              <dt className="col-4">状态</dt>
              <dd className="col-8">{detail.status}</dd>
              <dt className="col-4">备注</dt>
              <dd className="col-8">{detail.note || '无'}</dd>
            </dl>
          )}
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

const ViewToggleDemo = () => {
  const [view, setView] = useState<'card' | 'table'>('table');

  return (
    <>
      <ButtonGroup aria-label="视图切换" className="mb-3">
        <Button
          active={view === 'table'}
          onClick={() => setView('table')}
          variant={view === 'table' ? 'primary' : 'outline-primary'}
        >
          表格视图
        </Button>
        <Button
          active={view === 'card'}
          onClick={() => setView('card')}
          variant={view === 'card' ? 'primary' : 'outline-primary'}
        >
          卡片视图
        </Button>
      </ButtonGroup>
      {view === 'table' ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DOC_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell as="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="row g-3">
          {DOC_USERS.map((user) => (
            <div className="col-sm-6 col-lg-4" key={user.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {user.lastName}
                    {user.firstName}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">{user.username}</h6>
                  <p className="card-text mb-0">
                    编号 {user.id} · 状态 {user.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const SelectionDemo = () => {
  const selection = useTableSelection<number>();
  const userIds = DOC_USERS.map((user) => user.id);

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-body-secondary">已选 {selection.selectedCount} 行</span>
        {selection.selectedCount > 0 && (
          <Button onClick={selection.clear} size="sm" variant="outline-secondary">
            清除选择
          </Button>
        )}
      </div>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableSelectCell
              as="th"
              checked={selection.isAllSelected(userIds)}
              indeterminate={selection.isIndeterminate(userIds)}
              label="全选"
              onChange={() => selection.toggleAll(userIds)}
            />
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {DOC_USERS.map((user) => (
            <TableRow active={selection.isSelected(user.id)} key={user.id}>
              <TableSelectCell
                checked={selection.isSelected(user.id)}
                label={`选择 ${user.username}`}
                onChange={() => selection.toggle(user.id)}
                value={String(user.id)}
              />
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const InlineEditDemo = () => {
  const { rows, updateRow } = useTable<DocUser, number>({
    getRowKey: (user) => user.id,
    initialRows: DOC_USERS,
  });
  const editing = useTableEditing<number>();

  const cellProps = (user: DocUser) => ({
    editing: editing.isEditing(user.id),
    onEditingChange: (next: boolean) => (next ? editing.startEdit(user.id) : editing.cancelEdit()),
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell as="th" scope="col">
            #
          </TableCell>
          <TableCell as="th" scope="col">
            姓氏
          </TableCell>
          <TableCell as="th" scope="col">
            名字
          </TableCell>
          <TableCell as="th" scope="col">
            用户名
          </TableCell>
          <TableCell as="th" scope="col">
            状态
          </TableCell>
          <TableCell as="th" scope="col">
            备注
          </TableCell>
          <TableCell as="th" scope="col">
            操作
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((user) => (
          <TableRow key={user.id}>
            <TableCell as="th" scope="row">
              {user.id}
            </TableCell>
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) =>
                updateRow(user.id, (row) => ({ ...row, firstName: String(value) }))
              }
              validator={requiredValidator}
              value={user.firstName}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, lastName: String(value) }))}
              validator={requiredValidator}
              value={user.lastName}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, username: String(value) }))}
              validator={requiredValidator}
              value={user.username}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, status: String(value) }))}
              options={STATUS_OPTIONS}
              type="select"
              value={user.status}
            />
            <TableEditCell
              {...cellProps(user)}
              onSave={(value) => updateRow(user.id, (row) => ({ ...row, note: String(value) }))}
              type="textarea"
              value={user.note}
            />
            <TableCell>
              <Button
                onClick={() => editing.startEdit(user.id)}
                size="sm"
                variant="outline-primary"
              >
                编辑
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AddRowDemo = () => {
  const { addRow, rows } = useTable<DocUser, number>({
    getRowKey: (user) => user.id,
    initialRows: DOC_USERS,
  });
  const [draft, setDraft] = useState({ firstName: '', lastName: '', username: '' });
  const [nextId, setNextId] = useState(DOC_USERS.length + 1);

  const canAdd =
    draft.firstName.trim() !== '' && draft.lastName.trim() !== '' && draft.username.trim() !== '';

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }
    addRow({
      firstName: draft.firstName.trim(),
      id: nextId,
      lastName: draft.lastName.trim(),
      note: '',
      status: '在线',
      username: draft.username.trim(),
    });
    setNextId((id) => id + 1);
    setDraft({ firstName: '', lastName: '', username: '' });
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, firstName: event.target.value }))}
          placeholder="姓氏"
          style={{ maxWidth: '8rem' }}
          value={draft.firstName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, lastName: event.target.value }))}
          placeholder="名字"
          style={{ maxWidth: '8rem' }}
          value={draft.lastName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, username: event.target.value }))}
          placeholder="用户名"
          style={{ maxWidth: '12rem' }}
          value={draft.username}
        />
        <Button disabled={!canAdd} onClick={handleAdd} variant="primary">
          新增
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={4}>暂无数据，请使用上方表单新增</TableEmpty>}
        </TableBody>
      </Table>
    </>
  );
};

const DeleteRowDemo = () => {
  const { removeRow, rows } = useTable<DocUser, number>({
    getRowKey: (user) => user.id,
    initialRows: DOC_USERS,
  });
  const [deleteId, setDeleteId] = useState<number>();

  const deleteUser = rows.find((user) => user.id === deleteId);

  const handleConfirmDelete = () => {
    if (deleteId !== undefined) {
      removeRow(deleteId);
    }
    setDeleteId(undefined);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
            <TableCell as="th" scope="col">
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((user) => (
            <TableRow key={user.id}>
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Button onClick={() => setDeleteId(user.id)} size="sm" variant="outline-danger">
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={5}>暂无数据</TableEmpty>}
        </TableBody>
      </Table>
      <Modal
        isOpen={deleteId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(undefined);
          }
        }}
      >
        <ModalHeader closeButton>
          <ModalTitle>确认删除</ModalTitle>
        </ModalHeader>
        <ModalBody>确定要删除「{deleteUser?.username ?? ''}」吗？删除后无法恢复。</ModalBody>
        <ModalFooter>
          <Button onClick={() => setDeleteId(undefined)} variant="secondary">
            取消
          </Button>
          <Button onClick={handleConfirmDelete} variant="danger">
            删除
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const CrudDemo = () => {
  const { addRow, removeRow, removeRows, rows, updateRow } = useTable<DocUser, number>({
    getRowKey: (user) => user.id,
    initialRows: DOC_USERS,
  });
  const editing = useTableEditing<number>();
  const selection = useTableSelection<number>();
  const [deleteId, setDeleteId] = useState<number>();
  const [draft, setDraft] = useState({ firstName: '', lastName: '', username: '' });
  const [nextId, setNextId] = useState(DOC_USERS.length + 1);

  const canAdd =
    draft.firstName.trim() !== '' && draft.lastName.trim() !== '' && draft.username.trim() !== '';

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }
    addRow({
      firstName: draft.firstName.trim(),
      id: nextId,
      lastName: draft.lastName.trim(),
      note: '',
      status: '在线',
      username: draft.username.trim(),
    });
    setNextId((id) => id + 1);
    setDraft({ firstName: '', lastName: '', username: '' });
  };

  const handleBatchDelete = () => {
    removeRows(selection.selectedKeys);
    selection.clear();
  };

  const handleConfirmDelete = () => {
    if (deleteId !== undefined) {
      removeRow(deleteId);
    }
    setDeleteId(undefined);
  };

  const deleteUser = rows.find((user) => user.id === deleteId);

  const cellProps = (user: DocUser) => ({
    editing: editing.isEditing(user.id),
    onEditingChange: (next: boolean) => (next ? editing.startEdit(user.id) : editing.cancelEdit()),
  });

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, firstName: event.target.value }))}
          placeholder="姓氏"
          style={{ maxWidth: '7rem' }}
          value={draft.firstName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, lastName: event.target.value }))}
          placeholder="名字"
          style={{ maxWidth: '7rem' }}
          value={draft.lastName}
        />
        <FormControl
          onChange={(event) => setDraft((value) => ({ ...value, username: event.target.value }))}
          placeholder="用户名"
          style={{ maxWidth: '10rem' }}
          value={draft.username}
        />
        <Button disabled={!canAdd} onClick={handleAdd} variant="primary">
          新增
        </Button>
        {selection.selectedCount > 0 && (
          <Button onClick={handleBatchDelete} variant="outline-danger">
            删除选中（{selection.selectedCount}）
          </Button>
        )}
      </div>
      <Table hover>
        <TableHead>
          <TableRow>
            <TableSelectCell
              as="th"
              checked={selection.isAllSelected(rows.map((user) => user.id))}
              indeterminate={selection.isIndeterminate(rows.map((user) => user.id))}
              label="全选"
              onChange={() => selection.toggleAll(rows.map((user) => user.id))}
            />
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
            <TableCell as="th" scope="col">
              操作
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((user) => (
            <TableRow active={selection.isSelected(user.id)} key={user.id}>
              <TableSelectCell
                checked={selection.isSelected(user.id)}
                label={`选择 ${user.username}`}
                onChange={() => selection.toggle(user.id)}
                value={String(user.id)}
              />
              <TableCell as="th" scope="row">
                {user.id}
              </TableCell>
              <TableEditCell
                {...cellProps(user)}
                onSave={(value) =>
                  updateRow(user.id, (row) => ({ ...row, firstName: String(value) }))
                }
                value={user.firstName}
              />
              <TableEditCell
                {...cellProps(user)}
                onSave={(value) =>
                  updateRow(user.id, (row) => ({ ...row, lastName: String(value) }))
                }
                value={user.lastName}
              />
              <TableEditCell
                {...cellProps(user)}
                onSave={(value) =>
                  updateRow(user.id, (row) => ({ ...row, username: String(value) }))
                }
                value={user.username}
              />
              <TableCell>
                <div className="d-flex gap-1">
                  <Button
                    onClick={() => editing.startEdit(user.id)}
                    size="sm"
                    variant="outline-primary"
                  >
                    编辑
                  </Button>
                  <Button onClick={() => setDeleteId(user.id)} size="sm" variant="outline-danger">
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && <TableEmpty colSpan={6}>暂无数据，请使用上方表单新增</TableEmpty>}
        </TableBody>
      </Table>
      <Modal
        isOpen={deleteId !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(undefined);
          }
        }}
      >
        <ModalHeader closeButton>
          <ModalTitle>确认删除</ModalTitle>
        </ModalHeader>
        <ModalBody>确定要删除「{deleteUser?.username ?? ''}」吗？删除后无法恢复。</ModalBody>
        <ModalFooter>
          <Button onClick={() => setDeleteId(undefined)} variant="secondary">
            取消
          </Button>
          <Button onClick={handleConfirmDelete} variant="danger">
            删除
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const LoadingDemo = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Button
        className="mb-2"
        onClick={() => setLoading((value) => !value)}
        size="sm"
        variant="outline-primary"
      >
        {loading ? '模拟加载完成' : '模拟加载中'}
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableLoading colSpan={4}>加载中…</TableLoading>
          ) : (
            DOC_USERS.map((user) => (
              <TableRow key={user.id}>
                <TableCell as="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

const EmptyDemo = () => {
  const { addRow, rows } = useTable<DocUser, number>({
    getRowKey: (user) => user.id,
    initialRows: [],
  });
  const [nextId, setNextId] = useState(1);

  const handleAdd = () => {
    addRow({
      firstName: '张',
      id: nextId,
      lastName: '伟',
      note: '',
      status: '在线',
      username: `@user${nextId}`,
    });
    setNextId((id) => id + 1);
  };

  return (
    <>
      <Button className="mb-2" onClick={handleAdd} size="sm" variant="primary">
        新增一行
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th" scope="col">
              #
            </TableCell>
            <TableCell as="th" scope="col">
              姓氏
            </TableCell>
            <TableCell as="th" scope="col">
              名字
            </TableCell>
            <TableCell as="th" scope="col">
              用户名
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableEmpty colSpan={4}>
              暂无数据，
              <Button onClick={handleAdd} size="sm" variant="link">
                立即新增
              </Button>
            </TableEmpty>
          ) : (
            rows.map((user) => (
              <TableRow key={user.id}>
                <TableCell as="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

const tableProps: ApiProp[] = [
  {
    component: 'Table',
    defaultValue: '-',
    description: '表格整体的垂直对齐方式，渲染为 `align-top`、`align-middle` 或 `align-bottom` 类',
    name: 'align',
    type: 'TableAlign',
  },
  {
    component: 'Table',
    defaultValue: "'table'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Table',
    defaultValue: 'false',
    description: '为表格与所有单元格添加边框，渲染为 `table-bordered` 类',
    name: 'bordered',
    type: 'boolean',
  },
  {
    component: 'Table',
    defaultValue: 'false',
    description: '去除表格与单元格的边框，渲染为 `table-borderless` 类',
    name: 'borderless',
    type: 'boolean',
  },
  {
    component: 'Table',
    defaultValue: 'false',
    description: '悬停时高亮行，渲染为 `table-hover` 类',
    name: 'hover',
    type: 'boolean',
  },
  {
    component: 'Table',
    defaultValue: 'false',
    description:
      '响应式横向滚动容器，`true` 渲染 `table-responsive`，或传入断点 `sm`、`md`、`lg`、`xl`、`xxl` 从该断点起滚动',
    name: 'responsive',
    type: 'TableBreakpoint | boolean',
  },
  {
    component: 'Table',
    defaultValue: '-',
    description: '紧凑尺寸，渲染为 `table-sm` 类',
    name: 'size',
    type: 'TableSize',
  },
  {
    component: 'Table',
    defaultValue: 'false',
    description:
      '条纹样式，`true` 渲染 `table-striped`，或传 `columns` 渲染 `table-striped-columns`',
    name: 'striped',
    type: 'TableStriped',
  },
  {
    component: 'Table',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableCaption',
    defaultValue: "'caption'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableCaption',
    defaultValue: 'false',
    description: '将标题置于表格顶部，渲染为 `caption-top` 类',
    name: 'captionTop',
    type: 'boolean',
  },
  {
    component: 'TableHead',
    defaultValue: "'thead'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableHead',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableBody',
    defaultValue: "'tbody'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableBody',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableFooter',
    defaultValue: "'tfoot'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableFooter',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableRow',
    defaultValue: 'false',
    description: '激活状态，渲染为 `table-active` 类',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'TableRow',
    defaultValue: "'tr'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableRow',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableCell',
    defaultValue: 'false',
    description: '激活状态，渲染为 `table-active` 类',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'TableCell',
    defaultValue: '-',
    description: '单元格垂直对齐方式，渲染为 `align-top`、`align-middle` 或 `align-bottom` 类',
    name: 'align',
    type: 'TableAlign',
  },
  {
    component: 'TableCell',
    defaultValue: "'td'",
    description: '渲染的元素标签，默认 `td`，可传 `th` 渲染表头单元格',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableCell',
    defaultValue: '-',
    description: '表头单元格的关联范围，渲染为 `th` 时使用',
    name: 'scope',
    type: 'TableCellScope',
  },
  {
    component: 'TableCell',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableSelectCell',
    defaultValue: 'false',
    description: '激活状态，渲染为 `table-active` 类',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '单元格垂直对齐方式，渲染为 `align-top`、`align-middle` 或 `align-bottom` 类',
    name: 'align',
    type: 'TableAlign',
  },
  {
    component: 'TableSelectCell',
    defaultValue: "'td'",
    description: '渲染的元素标签，可传 `th` 作为表头全选单元格',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '受控选中状态',
    name: 'checked',
    type: 'boolean',
  },
  {
    component: 'TableSelectCell',
    defaultValue: 'false',
    description: '禁用复选框',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'TableSelectCell',
    defaultValue: 'false',
    description: '半选状态，常用于表头全选单元格',
    name: 'indeterminate',
    type: 'boolean',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '复选框无障碍标签，渲染为 `aria-label`',
    name: 'label',
    type: 'string',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '复选框原生 `name`',
    name: 'name',
    type: 'string',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '选中状态变化回调，携带选中值与原生事件',
    name: 'onChange',
    type: '(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '复选框原生 `value`，通常传行唯一键',
    name: 'value',
    type: 'string',
  },
  {
    component: 'TableSelectCell',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableExpandCell',
    defaultValue: 'false',
    description: '激活状态，渲染为 `table-active` 类',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'TableExpandCell',
    defaultValue: '-',
    description: '单元格垂直对齐方式，渲染为 `align-top`、`align-middle` 或 `align-bottom` 类',
    name: 'align',
    type: 'TableAlign',
  },
  {
    component: 'TableExpandCell',
    defaultValue: "'td'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableExpandCell',
    defaultValue: "'Collapse'",
    description: '展开状态下的开关无障碍标签，渲染为 `aria-label`',
    name: 'collapseLabel',
    type: 'string',
  },
  {
    component: 'TableExpandCell',
    defaultValue: 'false',
    description: '禁用展开开关',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'TableExpandCell',
    defaultValue: "'Expand'",
    description: '收起状态下的开关无障碍标签，渲染为 `aria-label`',
    name: 'expandLabel',
    type: 'string',
  },
  {
    component: 'TableExpandCell',
    defaultValue: 'false',
    description: '展开状态，设置 `aria-expanded` 并切换箭头方向',
    name: 'expanded',
    type: 'boolean',
  },
  {
    component: 'TableExpandCell',
    defaultValue: '-',
    description: '开关点击回调，携带切换后的展开状态与原生事件',
    name: 'onToggle',
    type: '(expanded: boolean, event: MouseEvent<HTMLButtonElement>) => void',
  },
  {
    component: 'TableExpandCell',
    defaultValue: '-',
    description: '情景颜色变体，渲染为 `table-*` 类',
    name: 'variant',
    type: 'TableVariant',
  },
  {
    component: 'TableEditCell',
    defaultValue: 'false',
    description: '激活状态，渲染为 `table-active` 类',
    name: 'active',
    type: 'boolean',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '单元格垂直对齐方式，渲染为 `align-top`、`align-middle` 或 `align-bottom` 类',
    name: 'align',
    type: 'TableAlign',
  },
  {
    component: 'TableEditCell',
    defaultValue: "'td'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableEditCell',
    defaultValue: "'Cancel'",
    description: '取消按钮无障碍标签，渲染为 `aria-label`',
    name: 'cancelLabel',
    type: 'string',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '自定义显示内容，不传时显示 `value`，双击单元格进入编辑',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'TableEditCell',
    defaultValue: 'false',
    description: '非受控初始编辑状态',
    name: 'defaultEditing',
    type: 'boolean',
  },
  {
    component: 'TableEditCell',
    defaultValue: "''",
    description: '非受控初始值',
    name: 'defaultValue',
    type: 'TableEditValue',
  },
  {
    component: 'TableEditCell',
    defaultValue: 'false',
    description: '禁用编辑',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '受控编辑状态',
    name: 'editing',
    type: 'boolean',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '编辑输入框原生属性',
    name: 'inputProps',
    type: 'InputHTMLAttributes<HTMLInputElement>',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '取消编辑回调',
    name: 'onCancel',
    type: '() => void',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '编辑状态变化回调，受控时由使用者更新 `editing`',
    name: 'onEditingChange',
    type: '(editing: boolean) => void',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '保存回调，携带校验通过后提交的值',
    name: 'onSave',
    type: '(value: TableEditValue) => void',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '`type` 为 `select` 时的选项列表',
    name: 'options',
    type: 'TableEditOption[]',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '编辑器占位文本',
    name: 'placeholder',
    type: 'string',
  },
  {
    component: 'TableEditCell',
    defaultValue: "'Save'",
    description: '保存按钮无障碍标签，渲染为 `aria-label`',
    name: 'saveLabel',
    type: 'string',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '`type` 为 `select` 时透传的原生属性',
    name: 'selectProps',
    type: 'SelectHTMLAttributes<HTMLSelectElement>',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '`type` 为 `textarea` 时透传的原生属性',
    name: 'textareaProps',
    type: 'TextareaHTMLAttributes<HTMLTextAreaElement>',
  },
  {
    component: 'TableEditCell',
    defaultValue: "'text'",
    description: '编辑器类型，支持 `text`、`number`、`select` 与 `textarea`',
    name: 'type',
    type: 'TableEditType',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '校验函数，返回错误信息时阻止保存并显示错误',
    name: 'validator',
    type: '(value: TableEditValue) => string | undefined',
  },
  {
    component: 'TableEditCell',
    defaultValue: '-',
    description: '受控值，进入编辑时作为初始草稿',
    name: 'value',
    type: 'TableEditValue',
  },
  {
    component: 'TableEmpty',
    defaultValue: '-',
    description: '空状态单元格自定义类名',
    name: 'cellClassName',
    type: 'string',
  },
  {
    component: 'TableEmpty',
    defaultValue: '-',
    description: '空状态内容，可放置提示文字与操作按钮',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'TableEmpty',
    defaultValue: '-',
    description: '空状态行自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'TableEmpty',
    defaultValue: '-',
    description: '空状态单元格跨列数，通常传表格总列数',
    name: 'colSpan',
    type: 'number',
  },
  {
    component: 'TableLoading',
    defaultValue: '-',
    description: '加载状态单元格自定义类名',
    name: 'cellClassName',
    type: 'string',
  },
  {
    component: 'TableLoading',
    defaultValue: '-',
    description: '加载状态内容，渲染在加载指示器右侧',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'TableLoading',
    defaultValue: '-',
    description: '加载状态行自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'TableLoading',
    defaultValue: '-',
    description: '加载状态单元格跨列数，通常传表格总列数',
    name: 'colSpan',
    type: 'number',
  },
  {
    component: 'TableResponsive',
    defaultValue: "'div'",
    description: '渲染的元素标签',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'TableResponsive',
    defaultValue: '-',
    description: '响应式断点，`true` 始终横向滚动，或传入断点 `sm`、`md`、`lg`、`xl`、`xxl`',
    name: 'breakpoint',
    type: 'TableBreakpoint | boolean',
  },
  {
    component: 'TableDetailRow',
    defaultValue: '-',
    description: '详情单元格自定义类名',
    name: 'cellClassName',
    type: 'string',
  },
  {
    component: 'TableDetailRow',
    defaultValue: '-',
    description: '展开后的详情内容，可放置字段网格、嵌套表格等任意内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'TableDetailRow',
    defaultValue: '-',
    description: '详情行自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'TableDetailRow',
    defaultValue: '-',
    description: '详情单元格跨列数，通常传表格总列数',
    name: 'colSpan',
    type: 'number',
  },
  {
    defaultValue: '-',
    description: '表格内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    defaultValue: '-',
    description: '透传原生元素属性（如 `onClick`、`style` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const tableTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: tableAlignTypeCode,
    description: '表格与单元格垂直对齐方式类型',
    name: 'TableAlign',
  },
  {
    code: tableBreakpointTypeCode,
    description: '响应式表格断点类型',
    name: 'TableBreakpoint',
  },
  {
    code: tableCellScopeTypeCode,
    description: '表头单元格关联范围类型',
    name: 'TableCellScope',
  },
  {
    code: tableEditOptionTypeCode,
    description: '行内编辑下拉选项类型',
    name: 'TableEditOption',
  },
  {
    code: tableEditTypeTypeCode,
    description: '行内编辑器类型',
    name: 'TableEditType',
  },
  {
    code: tableEditValueTypeCode,
    description: '行内编辑值类型',
    name: 'TableEditValue',
  },
  {
    code: tableSizeTypeCode,
    description: '表格尺寸类型',
    name: 'TableSize',
  },
  {
    code: tableStripedTypeCode,
    description: '表格条纹样式类型',
    name: 'TableStriped',
  },
  {
    code: tableVariantTypeCode,
    description: '表格情景颜色变体类型',
    name: 'TableVariant',
  },
  {
    code: tableCaptionPropsTypeCode,
    description: '表格标题组件属性接口',
    name: 'TableCaptionProps',
  },
  {
    code: tableCellPropsTypeCode,
    description: '表格单元格组件属性接口',
    name: 'TableCellProps',
  },
  {
    code: tableDetailRowPropsTypeCode,
    description: '展开详情行组件属性接口',
    name: 'TableDetailRowProps',
  },
  {
    code: tableEditCellPropsTypeCode,
    description: '行内编辑单元格组件属性接口',
    name: 'TableEditCellProps',
  },
  {
    code: tableEmptyPropsTypeCode,
    description: '空状态行组件属性接口',
    name: 'TableEmptyProps',
  },
  {
    code: tableExpandCellPropsTypeCode,
    description: '展开开关单元格组件属性接口',
    name: 'TableExpandCellProps',
  },
  {
    code: tableLoadingPropsTypeCode,
    description: '加载状态行组件属性接口',
    name: 'TableLoadingProps',
  },
  {
    code: tablePropsTypeCode,
    description: '表格容器组件属性接口',
    name: 'TableProps',
  },
  {
    code: tableResponsivePropsTypeCode,
    description: '响应式表格容器组件属性接口',
    name: 'TableResponsiveProps',
  },
  {
    code: tableRowPropsTypeCode,
    description: '表格行组件属性接口',
    name: 'TableRowProps',
  },
  {
    code: tableSectionPropsTypeCode,
    description: '表格分区（表头/表体/表尾）组件属性接口',
    name: 'TableSectionProps',
  },
  {
    code: tableSelectCellPropsTypeCode,
    description: '选择单元格组件属性接口',
    name: 'TableSelectCellProps',
  },
  {
    code: useTableEditingOptionsTypeCode,
    description: 'useTableEditing 配置参数接口',
    name: 'UseTableEditingOptions',
  },
  {
    code: useTableEditingResultTypeCode,
    description: 'useTableEditing 返回值接口',
    name: 'UseTableEditingResult',
  },
  {
    code: useTableExpansionOptionsTypeCode,
    description: 'useTableExpansion 配置参数接口',
    name: 'UseTableExpansionOptions',
  },
  {
    code: useTableExpansionResultTypeCode,
    description: 'useTableExpansion 返回值接口',
    name: 'UseTableExpansionResult',
  },
  {
    code: useTableOptionsTypeCode,
    description: 'useTable 配置参数接口',
    name: 'UseTableOptions',
  },
  {
    code: useTableResultTypeCode,
    description: 'useTable 返回值接口',
    name: 'UseTableResult',
  },
  {
    code: useTableSelectionOptionsTypeCode,
    description: 'useTableSelection 配置参数接口',
    name: 'UseTableSelectionOptions',
  },
  {
    code: useTableSelectionResultTypeCode,
    description: 'useTableSelection 返回值接口',
    name: 'UseTableSelectionResult',
  },
];

export const TableDoc = () => {
  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础示例">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={variantsCode} title="情景颜色">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <Table variant="primary">
            <TableBody>
              <TableRow>
                <TableCell>主要样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="secondary">
            <TableBody>
              <TableRow>
                <TableCell>次要样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="success">
            <TableBody>
              <TableRow>
                <TableCell>成功样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="danger">
            <TableBody>
              <TableRow>
                <TableCell>危险样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="warning">
            <TableBody>
              <TableRow>
                <TableCell>警告样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="info">
            <TableBody>
              <TableRow>
                <TableCell>信息样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="light">
            <TableBody>
              <TableRow>
                <TableCell>浅色样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table variant="dark">
            <TableBody>
              <TableRow>
                <TableCell>深色样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      <DemoSection code={stripedCode} title="条纹行">
        <Table striped>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                4
              </TableCell>
              <TableCell>刘</TableCell>
              <TableCell>强</TableCell>
              <TableCell>@liuqiang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                5
              </TableCell>
              <TableCell>陈</TableCell>
              <TableCell>静</TableCell>
              <TableCell>@chenjing</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={stripedColumnsCode} title="条纹列">
        <Table striped="columns">
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                4
              </TableCell>
              <TableCell>刘</TableCell>
              <TableCell>强</TableCell>
              <TableCell>@liuqiang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                5
              </TableCell>
              <TableCell>陈</TableCell>
              <TableCell>静</TableCell>
              <TableCell>@chenjing</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={hoverCode} title="悬停行">
        <Table hover>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                4
              </TableCell>
              <TableCell>刘</TableCell>
              <TableCell>强</TableCell>
              <TableCell>@liuqiang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                5
              </TableCell>
              <TableCell>陈</TableCell>
              <TableCell>静</TableCell>
              <TableCell>@chenjing</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={activeCode} title="激活状态">
        <div className="d-flex flex-wrap gap-3 align-items-start">
          <Table>
            <TableBody>
              <TableRow active>
                <TableCell as="th" scope="row">
                  1
                </TableCell>
                <TableCell>激活的行</TableCell>
                <TableCell>整行高亮</TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  2
                </TableCell>
                <TableCell>普通行</TableCell>
                <TableCell>默认样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell as="th" scope="row">
                  1
                </TableCell>
                <TableCell active>激活的单元格</TableCell>
                <TableCell>单个单元格高亮</TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  2
                </TableCell>
                <TableCell>普通单元格</TableCell>
                <TableCell>默认样式</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      <DemoSection code={borderedCode} title="边框表格">
        <Table bordered>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={borderlessCode} title="无边框表格">
        <Table borderless>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={smallCode} title="紧凑表格">
        <Table size="sm">
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={groupDividersCode} title="分组分隔线">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-group-divider">
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
          </TableBody>
          <TableBody className="table-group-divider">
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                4
              </TableCell>
              <TableCell>刘</TableCell>
              <TableCell>强</TableCell>
              <TableCell>@liuqiang</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={verticalAlignmentCode} title="垂直对齐">
        <div className="d-flex flex-column gap-3">
          <Table align="middle">
            <TableHead>
              <TableRow>
                <TableCell as="th" scope="col">
                  #
                </TableCell>
                <TableCell as="th" scope="col">
                  对齐方式
                </TableCell>
                <TableCell as="th" scope="col">
                  内容
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell as="th" scope="row">
                  1
                </TableCell>
                <TableCell>继承表格的垂直对齐</TableCell>
                <TableCell>
                  这里是一段很长的内容，用于把整行撑高，
                  <br />
                  以便观察单元格的垂直对齐效果，
                  <br />
                  表格设置了对齐方式为 middle。
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table align="middle">
            <TableBody>
              <TableRow>
                <TableCell align="top" as="th" scope="row">
                  顶部对齐
                </TableCell>
                <TableCell align="middle">垂直居中</TableCell>
                <TableCell align="bottom">底部对齐</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DemoSection>

      <DemoSection code={nestingCode} title="嵌套表格">
        <Table bordered striped>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell colSpan={3}>
                嵌套表格：
                <Table size="sm">
                  <TableHead>
                    <TableRow>
                      <TableCell as="th" scope="col">
                        标签
                      </TableCell>
                      <TableCell as="th" scope="col">
                        值
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>角色</TableCell>
                      <TableCell>管理员</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>状态</TableCell>
                      <TableCell>在线</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={anatomyCode} title="表格结构">
        <Table>
          <TableCaption>用户列表</TableCaption>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>总计</TableCell>
              <TableCell>3 人</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DemoSection>

      <DemoSection code={captionTopCode} title="标题置顶">
        <Table>
          <TableCaption captionTop>用户列表</TableCaption>
          <TableHead>
            <TableRow>
              <TableCell as="th" scope="col">
                #
              </TableCell>
              <TableCell as="th" scope="col">
                姓氏
              </TableCell>
              <TableCell as="th" scope="col">
                名字
              </TableCell>
              <TableCell as="th" scope="col">
                用户名
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell as="th" scope="row">
                1
              </TableCell>
              <TableCell>张</TableCell>
              <TableCell>伟</TableCell>
              <TableCell>@zhangwei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                2
              </TableCell>
              <TableCell>李</TableCell>
              <TableCell>磊</TableCell>
              <TableCell>@lilei</TableCell>
            </TableRow>
            <TableRow>
              <TableCell as="th" scope="row">
                3
              </TableCell>
              <TableCell>王</TableCell>
              <TableCell>芳</TableCell>
              <TableCell>@wangfang</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DemoSection>

      <DemoSection code={responsiveCode} title="响应式表格">
        <div className="d-flex flex-column gap-3">
          <Table responsive>
            <TableHead>
              <TableRow>
                <TableCell as="th" scope="col">
                  #
                </TableCell>
                <TableCell as="th" scope="col">
                  姓氏
                </TableCell>
                <TableCell as="th" scope="col">
                  名字
                </TableCell>
                <TableCell as="th" scope="col">
                  用户名
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell as="th" scope="row">
                  1
                </TableCell>
                <TableCell>张</TableCell>
                <TableCell>伟</TableCell>
                <TableCell>@zhangwei</TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  2
                </TableCell>
                <TableCell>李</TableCell>
                <TableCell>磊</TableCell>
                <TableCell>@lilei</TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  3
                </TableCell>
                <TableCell>王</TableCell>
                <TableCell>芳</TableCell>
                <TableCell>@wangfang</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table responsive="md">
            <TableHead>
              <TableRow>
                <TableCell as="th" scope="col">
                  #
                </TableCell>
                <TableCell as="th" scope="col">
                  姓氏
                </TableCell>
                <TableCell as="th" scope="col">
                  名字
                </TableCell>
                <TableCell as="th" scope="col">
                  用户名
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell as="th" scope="row">
                  1
                </TableCell>
                <TableCell>张</TableCell>
                <TableCell>伟</TableCell>
                <TableCell>@zhangwei</TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  2
                </TableCell>
                <TableCell>李</TableCell>
                <TableCell>磊</TableCell>
                <TableCell>@lilei</TableCell>
              </TableRow>
              <TableRow>
                <TableCell as="th" scope="row">
                  3
                </TableCell>
                <TableCell>王</TableCell>
                <TableCell>芳</TableCell>
                <TableCell>@wangfang</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <TableResponsive breakpoint="lg">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th" scope="col">
                    #
                  </TableCell>
                  <TableCell as="th" scope="col">
                    姓氏
                  </TableCell>
                  <TableCell as="th" scope="col">
                    名字
                  </TableCell>
                  <TableCell as="th" scope="col">
                    用户名
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell as="th" scope="row">
                    1
                  </TableCell>
                  <TableCell>张</TableCell>
                  <TableCell>伟</TableCell>
                  <TableCell>@zhangwei</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    2
                  </TableCell>
                  <TableCell>李</TableCell>
                  <TableCell>磊</TableCell>
                  <TableCell>@lilei</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell as="th" scope="row">
                    3
                  </TableCell>
                  <TableCell>王</TableCell>
                  <TableCell>芳</TableCell>
                  <TableCell>@wangfang</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableResponsive>
        </div>
      </DemoSection>

      <DemoSection code={selectionCode} title="多选">
        <SelectionDemo />
      </DemoSection>

      <DemoSection code={inlineEditCode} title="行内编辑">
        <InlineEditDemo />
      </DemoSection>

      <DemoSection code={addRowCode} title="新增行">
        <AddRowDemo />
      </DemoSection>

      <DemoSection code={deleteRowCode} title="删除行">
        <DeleteRowDemo />
      </DemoSection>

      <DemoSection code={crudCode} title="完整 CRUD 示例">
        <CrudDemo />
      </DemoSection>

      <DemoSection code={loadingCode} title="加载状态">
        <LoadingDemo />
      </DemoSection>

      <DemoSection code={emptyCode} title="空状态">
        <EmptyDemo />
      </DemoSection>

      <DemoSection code={expandableCode} title="展开行详情">
        <ExpandableDemo />
      </DemoSection>

      <DemoSection code={masterDetailCode} title="主从视图">
        <MasterDetailDemo />
      </DemoSection>

      <DemoSection code={detailModalCode} title="详情弹窗">
        <DetailModalDemo />
      </DemoSection>

      <DemoSection code={detailDrawerCode} title="详情抽屉">
        <DetailDrawerDemo />
      </DemoSection>

      <DemoSection code={viewToggleCode} title="视图切换">
        <ViewToggleDemo />
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的表格组件，提供表格容器与表头/表体/表尾、行、单元格、标题等结构组件，支持情景颜色、条纹行/列、悬停与激活状态、边框、紧凑尺寸、分组分隔线、垂直对齐、嵌套、标题置顶与响应式滚动容器；并通过选择单元格、行内编辑单元格、加载/空状态行以及 useTable、useTableSelection、useTableEditing 钩子完整支持多选、增删改查等交互场景，配合展开开关单元格、详情行与 useTableExpansion 钩子可实现展开行、主从视图、详情弹窗、详情抽屉与表格/卡片视图切换等多种查看详情方式"
      componentName="Table"
      componentTags={['基础', '布局']}
      demoContent={demoContent}
      props={tableProps}
      typeDefinitions={tableTypeDefinitions}
    />
  );
};

export default TableDoc;
