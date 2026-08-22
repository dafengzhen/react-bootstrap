import type { InputGroupRadioProps } from './types';

import { createInputGroupCheck } from './input-group-check';

export const InputGroupRadio = createInputGroupCheck<InputGroupRadioProps>('radio');

InputGroupRadio.displayName = 'InputGroupRadio';

export default InputGroupRadio;
