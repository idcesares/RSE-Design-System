// Public entry point for the Rede Sesc de Educação design system.
// Import components from here — never from a component file directly, so a component
// can be re-pathed or re-implemented without touching consuming code.
//
// Static HTML pages do not use this file: they load `dist/rse.js`, which exposes the
// same components on window.RSE. See AGENTS.md.

// Core
export { Avatar } from './components/core/Avatar.jsx';
export { Badge } from './components/core/Badge.jsx';
export { Button } from './components/core/Button.jsx';
export { Card } from './components/core/Card.jsx';
export { CtaBand } from './components/core/CtaBand.jsx';
export { Divider } from './components/core/Divider.jsx';
export { Icon, iconNames } from './components/core/Icon.jsx';
export { IconButton } from './components/core/IconButton.jsx';
export { Tag } from './components/core/Tag.jsx';

// Brand
export { BrandMotif, motifVariants, motifHues } from './components/brand/BrandMotif.jsx';
export { PlatformEntry } from './components/brand/PlatformEntry.jsx';

// Forms
export { Checkbox } from './components/forms/Checkbox.jsx';
export { DateField } from './components/forms/DateField.jsx';
export { FileUpload } from './components/forms/FileUpload.jsx';
export { FilterChips } from './components/forms/FilterChips.jsx';
export { Input } from './components/forms/Input.jsx';
export { Radio } from './components/forms/Radio.jsx';
export { Select } from './components/forms/Select.jsx';
export { Stepper } from './components/forms/Stepper.jsx';
export { Switch } from './components/forms/Switch.jsx';
export { Textarea } from './components/forms/Textarea.jsx';

// Navigation
export { Breadcrumb } from './components/navigation/Breadcrumb.jsx';
export { Footer } from './components/navigation/Footer.jsx';
export { Menu } from './components/navigation/Menu.jsx';
export { Navbar } from './components/navigation/Navbar.jsx';
export { Pagination } from './components/navigation/Pagination.jsx';
export { Tabs } from './components/navigation/Tabs.jsx';

// Feedback
export { Alert } from './components/feedback/Alert.jsx';
export { ProgressBar } from './components/feedback/ProgressBar.jsx';
export { Skeleton } from './components/feedback/Skeleton.jsx';
export { Spinner } from './components/feedback/Spinner.jsx';
export { Toast } from './components/feedback/Toast.jsx';
export { Tooltip } from './components/feedback/Tooltip.jsx';

// Data
export { DataTable } from './components/data/DataTable.jsx';
export { Stat } from './components/data/Stat.jsx';
export { StatBand } from './components/data/StatBand.jsx';

// Disclosure
export { Accordion } from './components/disclosure/Accordion.jsx';

// Overlay
export { Modal } from './components/overlay/Modal.jsx';
