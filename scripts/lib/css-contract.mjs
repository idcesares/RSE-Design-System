// Shared stylesheet ownership: some wrappers render another component's contract.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const shared = {
  'components/core/IconButton.jsx': 'components/core/Button.css',
  'components/forms/DateField.jsx': 'components/forms/Input.css',
};

export function cssContractPath(root, sourcePath) {
  const path = shared[sourcePath] || sourcePath.replace(/\.jsx$/, '.css');
  return existsSync(join(root, path)) ? path : null;
}
