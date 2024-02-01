export type DaysiUiTone = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'ghost';
type DaysiUiComponents = 'btn' | 'input';

export function addComponentClass(classes: string | undefined | null, component: DaysiUiComponents, tone: DaysiUiTone = 'neutral') {
  if (!classes) return `${component} ${component}-${tone}`;
  return `${classes} ${component} ${component}-${tone}`;
}
