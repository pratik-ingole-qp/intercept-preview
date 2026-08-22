export type InterceptType = 'popup' | 'feedback' | 'exit' | 'embed' | 'mobile';
export type Vertical = 'top' | 'center' | 'bottom';
export type Horizontal = 'left' | 'center' | 'right';
export type BackdropKind = 'shop' | 'saas' | 'article' | 'landing' | 'shot' | 'live';
export type SampleBackdrop = 'shop' | 'saas' | 'article' | 'landing';
export type Anim = 'none' | 'fade' | 'slide' | 'pop';
export type Display = 'label' | 'logo' | 'both' | 'plusIcon';
export type Align = 'left' | 'center' | 'right';
export type OptInLayout = 'row' | 'column';
export type ViewKey = 'preview' | 'rules' | 'settings' | 'mapping' | 'identity' | 'setup' | 'examples';

export interface WidgetState {
  type: InterceptType;
  v: Vertical;
  h: Horizontal;
  overlay: boolean;
  opacity: number;
  anim: Anim;
  buttons: 1 | 2;
  layout: OptInLayout;
  customCopy: boolean;
  display: Display;
  align: Align;
  backdrop: BackdropKind;
  shot: string | null;
  liveUrl: string;
}

export const DEFAULT_STATE: WidgetState = {
  type: 'popup',
  v: 'bottom',
  h: 'right',
  overlay: true,
  opacity: 31,
  anim: 'none',
  buttons: 1,
  layout: 'row',
  customCopy: true,
  display: 'label',
  align: 'center',
  backdrop: 'shop',
  shot: null,
  liveUrl: '',
};
