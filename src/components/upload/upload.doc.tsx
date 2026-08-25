import { useEffect, useState } from 'react';

import type { UploadFile } from './types';

import { Button } from '../button';
import { type ApiProp, type ApiTypeDefinition, DemoSection, DocTemplate } from '../doc-template';
import basicCode from './demos/basic.md?raw';
import beforeUploadCode from './demos/before-upload.md?raw';
import controlledCode from './demos/controlled.md?raw';
import customListCode from './demos/custom-list.md?raw';
import customCode from './demos/custom.md?raw';
import disabledCode from './demos/disabled.md?raw';
import dropzoneCode from './demos/dropzone.md?raw';
import interactiveCode from './demos/interactive.md?raw';
import limitsCode from './demos/limits.md?raw';
import multipleCode from './demos/multiple.md?raw';
import uploadBeforeUploadTypeCode from './types/upload-before-upload.md?raw';
import uploadContextValueTypeCode from './types/upload-context-value.md?raw';
import uploadFileTypeCode from './types/upload-file.md?raw';
import uploadItemPropsTypeCode from './types/upload-item-props.md?raw';
import uploadListPropsTypeCode from './types/upload-list-props.md?raw';
import uploadPropsTypeCode from './types/upload-props.md?raw';
import uploadStatusTypeCode from './types/upload-status.md?raw';
import { Upload } from './upload';
import { useUpload } from './upload-context';
import { UploadItem } from './upload-item';
import { UploadList } from './upload-list';

const uploadProps: ApiProp[] = [
  {
    component: 'Upload',
    defaultValue: '-',
    description:
      '原生 `input` 的 `accept` 属性，限制文件选择对话框中的可选文件类型；拖拽文件不受其约束，可配合 `beforeUpload` 过滤',
    name: 'accept',
    type: 'string',
  },
  {
    component: 'Upload',
    defaultValue: "'div'",
    description: '根容器渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description:
      '上传前校验，对每个候选文件调用；返回 `false`（或 `resolve(false)`）时该文件被拒绝，不会进入文件列表',
    name: 'beforeUpload',
    type: 'UploadBeforeUpload',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '原生 `input` 的 `capture` 属性，移动端可直接唤起相机等设备',
    name: 'capture',
    type: "boolean | 'environment' | 'user'",
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '自定义触发器内容，默认渲染内置上传按钮（拖拽模式下为拖拽提示区）',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '自定义类名，作用于根容器',
    name: 'className',
    type: 'string',
  },
  {
    component: 'Upload',
    defaultValue: '[]',
    description: '非受控模式下的初始文件列表',
    name: 'defaultFiles',
    type: 'UploadFile[]',
  },
  {
    component: 'Upload',
    defaultValue: 'false',
    description: '是否禁用整个上传组件，禁用后无法打开文件选择且无法移除文件',
    name: 'disabled',
    type: 'boolean',
  },
  {
    component: 'Upload',
    defaultValue: 'false',
    description: '是否启用拖拽上传区域，此时触发器渲染为虚线框拖放区',
    name: 'dropzone',
    type: 'boolean',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '受控的文件列表，配合 `onFilesChange` 使用；传入后组件不再维护内部状态',
    name: 'files',
    type: 'UploadFile[]',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '透传给内置列表中每个 `UploadItem` 的属性（`file` 除外）',
    name: 'itemProps',
    type: "Omit<UploadItemProps, 'file'>",
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '透传给内置 `UploadList` 的属性（`children` 除外）',
    name: 'listProps',
    type: "Omit<UploadListProps, 'children'>",
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '最多允许的文件数量，达到上限后触发器不可用；超出限制大小的错误项同样计入数量',
    name: 'maxCount',
    type: 'number',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '单个文件的最大字节数，超出时该文件以 `error` 状态进入列表并附带错误信息',
    name: 'maxSize',
    type: 'number',
  },
  {
    component: 'Upload',
    defaultValue: 'false',
    description: '是否允许一次选择多个文件',
    name: 'multiple',
    type: 'boolean',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '原生 `input` 的 `name` 属性，用于表单提交',
    name: 'name',
    type: 'string',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description: '文件列表变化（新增或移除）时的回调，携带最新的完整文件列表',
    name: 'onFilesChange',
    type: '(files: UploadFile[]) => void',
  },
  {
    component: 'Upload',
    defaultValue: 'true',
    description: '是否渲染内置文件列表；设为 `false` 时可改用 `UploadList` / `UploadItem` 手动渲染',
    name: 'showUploadList',
    type: 'boolean',
  },
  {
    component: 'Upload',
    defaultValue: '-',
    description:
      '根容器的所有原生属性（`onChange` 除外，内部 input 的变更通过 `onFilesChange` 暴露）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'UploadItem',
    defaultValue: "'li'",
    description: '渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'UploadItem',
    defaultValue: '-',
    description: '信息列内附加的自定义内容',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'UploadItem',
    defaultValue: '-',
    description: '自定义类名',
    name: 'className',
    type: 'string',
  },
  {
    component: 'UploadItem',
    defaultValue: '-',
    description: '要渲染的文件记录，status 决定图标、进度条与错误提示的展示',
    name: 'file',
    type: 'UploadFile',
  },
  {
    component: 'UploadItem',
    defaultValue: '-',
    description: '移除回调；位于 `Upload` 内部时默认使用上下文的移除逻辑，独立使用时需手动传入',
    name: 'onRemove',
    type: '(file: UploadFile) => void',
  },
  {
    component: 'UploadItem',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`data-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
  {
    component: 'UploadList',
    defaultValue: "'ul'",
    description: '渲染的元素类型',
    name: 'as',
    type: 'ElementType',
  },
  {
    component: 'UploadList',
    defaultValue: '-',
    description: '列表内容，通常为多个 `UploadItem`',
    name: 'children',
    type: 'ReactNode',
  },
  {
    component: 'UploadList',
    defaultValue: '-',
    description: '自定义类名，可配合 `mt-*` 等工具类调整间距',
    name: 'className',
    type: 'string',
  },
  {
    component: 'UploadList',
    defaultValue: '-',
    description: '根元素的所有原生属性（如 `style`、`aria-*` 等）',
    name: '...rest',
    type: 'HTMLAttributes',
  },
];

const uploadTypeDefinitions: ApiTypeDefinition[] = [
  {
    code: uploadBeforeUploadTypeCode,
    description: '上传前校验函数类型，支持同步返回与异步 Promise',
    name: 'UploadBeforeUpload',
  },
  {
    code: uploadContextValueTypeCode,
    description: '上传上下文值，可通过 `useUpload` 获取（不在 `Upload` 内返回 `null`）',
    name: 'UploadContextValue',
  },
  {
    code: uploadFileTypeCode,
    description: '文件记录结构，`raw` 保留原生 File 对象以便自行上传',
    name: 'UploadFile',
  },
  {
    code: uploadItemPropsTypeCode,
    description: '文件条目组件属性接口',
    name: 'UploadItemProps',
  },
  {
    code: uploadListPropsTypeCode,
    description: '文件列表组件属性接口',
    name: 'UploadListProps',
  },
  {
    code: uploadPropsTypeCode,
    description: '上传组件属性接口',
    name: 'UploadProps',
  },
  {
    code: uploadStatusTypeCode,
    description: '文件状态类型，驱动条目的图标、进度条与错误提示',
    name: 'UploadStatus',
  },
];

const CustomTrigger = () => {
  const upload = useUpload();

  return (
    <button
      className="btn btn-outline-primary"
      onClick={(event) => {
        event.stopPropagation();
        upload?.openFileDialog();
      }}
      type="button"
    >
      选择文件
    </button>
  );
};

export const UploadDoc = () => {
  const [controlledFiles, setControlledFiles] = useState<UploadFile[]>([]);
  const [interactiveFiles, setInteractiveFiles] = useState<UploadFile[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const hasReadyFiles = interactiveFiles.some((file) => file.status === 'ready');
  const isUploading = interactiveFiles.some((file) => file.status === 'uploading');

  useEffect(() => {
    if (!isUploading) {
      return;
    }
    const timer = window.setInterval(() => {
      setInteractiveFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') {
            return file;
          }
          const percent = Math.min(100, (file.percent ?? 0) + 20);
          return { ...file, percent, status: percent >= 100 ? 'success' : 'uploading' };
        }),
      );
    }, 300);
    return () => window.clearInterval(timer);
  }, [isUploading]);

  const handleAdd = () => {
    setControlledFiles((prev) => [
      ...prev,
      {
        name: `document-${prev.length + 1}.pdf`,
        size: 2048,
        status: 'ready',
        uid: `uid-${prev.length + 1}`,
      },
    ]);
  };

  const handleClear = () => {
    setControlledFiles([]);
  };

  const handleInteractiveClear = () => {
    setInteractiveFiles([]);
  };

  const handleRemove = (file: UploadFile) => {
    setInteractiveFiles((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const handleStart = () => {
    setInteractiveFiles((prev) =>
      prev.map((file) =>
        file.status === 'ready' ? { ...file, percent: 0, status: 'uploading' } : file,
      ),
    );
  };

  const beforeUpload = (file: File) => {
    if (file.name.endsWith('.txt')) {
      setRejected((prev) => [...prev, file.name]);
      return false;
    }
    return true;
  };

  const demoContent = (
    <>
      <DemoSection code={basicCode} title="基础用法">
        <Upload />
        <p className="mb-0 mt-3 text-muted small">
          默认渲染内置的上传按钮与文件列表，选择文件后以列表条目展示名称与大小，可单独移除
        </p>
      </DemoSection>

      <DemoSection code={dropzoneCode} title="拖拽上传">
        <Upload dropzone>
          <span className="text-secondary">点击选择文件，或将文件拖拽到此处上传</span>
        </Upload>
        <p className="mb-0 mt-3 text-muted small">
          dropzone 开启后触发器渲染为虚线拖放区，支持点击选择与拖拽投放两种方式，拖拽悬停时高亮
        </p>
      </DemoSection>

      <DemoSection code={multipleCode} title="多选与文件类型">
        <div className="d-flex flex-column gap-3">
          <Upload multiple />
          <Upload accept="image/*" multiple />
        </div>
        <p className="mb-0 mt-3 text-muted small">
          multiple 允许一次选择多个文件；accept 限制文件选择对话框中的可选类型（拖拽文件不受影响，
          可通过 beforeUpload 过滤）
        </p>
      </DemoSection>

      <DemoSection code={disabledCode} title="禁用状态">
        <Upload disabled />
        <p className="mb-0 mt-3 text-muted small">
          disabled 禁用后无法打开文件选择，也无法移除已有条目
        </p>
      </DemoSection>

      <DemoSection code={limitsCode} title="数量与大小限制">
        <Upload maxCount={3} maxSize={1024 * 1024} multiple />
        <p className="mb-0 mt-3 text-muted small">
          maxCount 限制最多 3 个文件，达到上限后触发器不可用；maxSize 限制单个文件不超过 1MB，
          超出的文件以错误状态进入列表，可移除后继续选择
        </p>
      </DemoSection>

      <DemoSection code={beforeUploadCode} title="上传前校验">
        <Upload beforeUpload={beforeUpload} multiple />
        <p className="mb-0 mt-3 text-muted small">
          beforeUpload 对每个候选文件调用，返回 false 时该文件被拒绝；已拒绝：
          {rejected.join('、') || '无'}
          。也支持返回 Promise 进行异步校验
        </p>
      </DemoSection>

      <DemoSection code={controlledCode} title="受控模式">
        <Upload files={controlledFiles} onFilesChange={setControlledFiles} />
        <div className="d-flex gap-2 mt-3">
          <Button onClick={handleAdd} variant="outline-secondary">
            添加模拟文件
          </Button>
          <Button onClick={handleClear} variant="outline-secondary">
            清空列表
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          传入 files 后组件不再维护内部状态，列表完全由外部控制，onFilesChange
          反馈每次新增与移除后的最新列表
        </p>
      </DemoSection>

      <DemoSection code={customCode} title="自定义触发器">
        <Upload>
          <CustomTrigger />
        </Upload>
        <p className="mb-0 mt-3 text-muted small">
          children 自定义触发器内容，整个触发器区域点击均可唤起文件选择；内部交互元素需
          stopPropagation 后通过 useUpload 的 openFileDialog 打开
        </p>
      </DemoSection>

      <DemoSection code={customListCode} title="自定义列表">
        <Upload onFilesChange={setInteractiveFiles} showUploadList={false}>
          <span className="btn btn-secondary">选择文件</span>
        </Upload>
        <UploadList className="mt-2">
          {interactiveFiles.map((file) => (
            <UploadItem file={file} key={file.uid} onRemove={handleRemove} />
          ))}
        </UploadList>
        <p className="mb-0 mt-3 text-muted small">
          showUploadList 设为 false 关闭内置列表后，可改用 UploadList 与 UploadItem
          在任意位置手动渲染文件条目
        </p>
      </DemoSection>

      <DemoSection code={interactiveCode} title="模拟上传进度">
        <Upload files={interactiveFiles} onFilesChange={setInteractiveFiles} />
        <div className="d-flex gap-2 mt-3">
          <Button disabled={!hasReadyFiles || isUploading} onClick={handleStart} variant="primary">
            {isUploading ? '上传中…' : '开始上传'}
          </Button>
          <Button onClick={handleInteractiveClear} variant="outline-secondary">
            清空
          </Button>
        </div>
        <p className="mb-0 mt-3 text-muted small">
          通过受控 files 更新每个条目的 status 与
          percent，即可驱动上传中进度条、成功/失败图标等状态展示
        </p>
      </DemoSection>
    </>
  );

  return (
    <DocTemplate
      componentDescription="基于 Bootstrap 5 的上传组件，提供文件选择、拖拽上传、数量与大小限制、上传前校验与内置文件列表，并支持受控文件列表、自定义触发器与列表，配合 UploadItem / UploadList / useUpload 灵活组合上传流程"
      componentName="Upload"
      componentTags={['基础', '表单']}
      demoContent={demoContent}
      props={uploadProps}
      typeDefinitions={uploadTypeDefinitions}
    />
  );
};

export default UploadDoc;
