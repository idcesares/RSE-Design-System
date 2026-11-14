// Public entry point for the Rede Sesc de Educação design system.
// Import components from here — never from a component file directly, so a component
// can be re-pathed or re-implemented without touching consuming code.
//
// Static HTML pages do not use this file: they load `dist/rse.js`, which exposes the
// same components on window.RSE. See AGENTS.md.

// Core
export { Avatar } from './components/core/Avatar.js';
export { Badge } from './components/core/Badge.js';
export { Button } from './components/core/Button.js';
export { Card } from './components/core/Card.js';
export { CtaBand } from './components/core/CtaBand.js';
export { Divider } from './components/core/Divider.js';
export { Hero } from './components/core/Hero.js';
export { Icon, iconNames } from './components/core/Icon.js';
export { IconButton } from './components/core/IconButton.js';
export { Tag } from './components/core/Tag.js';
export { Testimonial } from './components/core/Testimonial.js';

// Brand
export { BrandMotif, motifVariants, motifHues, motifDefaultHues } from './components/brand/BrandMotif.js';
export { MotifEngine, isoPoint, motifBar, motifCube, makeMotifShape, motifFaces, motifPieces, motifToSvg, motifShapeNames, motifShapes, renderMotifPattern, MAX_PATTERN_CELLS } from './components/brand/MotifEngine.js';
export { MotifPattern } from './components/brand/MotifPattern.js';
export { PlatformEntry } from './components/brand/PlatformEntry.js';

// Forms
export { Checkbox } from './components/forms/Checkbox.js';
export { DateField } from './components/forms/DateField.js';
export { FileUpload } from './components/forms/FileUpload.js';
export { FilterChips } from './components/forms/FilterChips.js';
export { Input } from './components/forms/Input.js';
export { Radio } from './components/forms/Radio.js';
export { Select } from './components/forms/Select.js';
export { Stepper } from './components/forms/Stepper.js';
export { Switch } from './components/forms/Switch.js';
export { Textarea } from './components/forms/Textarea.js';

// Navigation
export { Breadcrumb } from './components/navigation/Breadcrumb.js';
export { Footer } from './components/navigation/Footer.js';
export { Menu } from './components/navigation/Menu.js';
export { Navbar } from './components/navigation/Navbar.js';
export { Pagination } from './components/navigation/Pagination.js';
export { Tabs } from './components/navigation/Tabs.js';

// Feedback
export { Alert } from './components/feedback/Alert.js';
export { MotifLoader } from './components/feedback/MotifLoader.js';
export { ProgressBar } from './components/feedback/ProgressBar.js';
export { Skeleton } from './components/feedback/Skeleton.js';
export { Spinner } from './components/feedback/Spinner.js';
export { Toast } from './components/feedback/Toast.js';
export { Tooltip } from './components/feedback/Tooltip.js';

// Data
export { DataTable } from './components/data/DataTable.js';
export { Stat } from './components/data/Stat.js';
export { StatBand } from './components/data/StatBand.js';

// Disclosure
export { Accordion } from './components/disclosure/Accordion.js';

// Overlay
export { Modal } from './components/overlay/Modal.js';
