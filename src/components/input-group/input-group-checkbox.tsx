import type { InputGroupCheckboxProps } from './types';

import { createInputGroupCheck } from './input-group-check';

export const InputGroupCheckbox = createInputGroupCheck<InputGroupCheckboxProps>('checkbox');

InputGroupCheckbox.displayName = 'InputGroupCheckbox';

export default InputGroupCheckbox;
