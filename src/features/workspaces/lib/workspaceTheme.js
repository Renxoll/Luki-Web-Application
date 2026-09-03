import {
  Wallet,
  Briefcase,
  Baby,
  Home,
  Plane,
  GraduationCap,
  Heart,
  Car,
  ShoppingCart,
  Gift,
  PiggyBank,
  Building2,
  Landmark,
  Rocket,
  Dog,
  Dumbbell,
  Palette,
  Leaf,
  Coins,
  TrendingUp,
  Utensils,
  Film,
  HeartPulse,
  ShoppingBag,
  Receipt,
  BookOpen,
  CircleHelp,
  Folder,
} from 'lucide-react'

/** Íconos ofrecidos en el selector al crear/editar un módulo. */
export const WORKSPACE_ICON_OPTIONS = [
  'wallet',
  'briefcase',
  'baby',
  'home',
  'plane',
  'graduation-cap',
  'heart',
  'car',
  'shopping-cart',
  'gift',
  'piggy-bank',
  'building-2',
  'landmark',
  'rocket',
  'dog',
  'dumbbell',
  'palette',
  'leaf',
  'coins',
  'trending-up',
]

// Mapa normalizado (sin guiones, minúsculas) -> componente. Cubre los íconos de módulo y
// los del catálogo global de categorías (utensils, heart-pulse, shopping-bag, ...).
const ICONS = {
  wallet: Wallet,
  briefcase: Briefcase,
  baby: Baby,
  home: Home,
  plane: Plane,
  graduationcap: GraduationCap,
  heart: Heart,
  heartpulse: HeartPulse,
  car: Car,
  shoppingcart: ShoppingCart,
  shoppingbag: ShoppingBag,
  gift: Gift,
  piggybank: PiggyBank,
  building2: Building2,
  landmark: Landmark,
  rocket: Rocket,
  dog: Dog,
  dumbbell: Dumbbell,
  palette: Palette,
  leaf: Leaf,
  coins: Coins,
  trendingup: TrendingUp,
  utensils: Utensils,
  film: Film,
  receipt: Receipt,
  book: BookOpen,
  circlehelp: CircleHelp,
  folder: Folder,
}

/** Devuelve el componente de ícono para un nombre (kebab o no); Folder como respaldo. */
export function resolveIcon(name) {
  const key = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return ICONS[key] || Folder
}

/** Paleta ofrecida al crear/editar un módulo -- tonos que leen bien sobre el fondo oscuro. */
export const WORKSPACE_COLOR_OPTIONS = [
  '#8B5CF6',
  '#6366F1',
  '#0EA5E9',
  '#06B6D4',
  '#10B981',
  '#84CC16',
  '#F59E0B',
  '#F97316',
  '#F43F5E',
  '#D946EF',
]

export const DEFAULT_WORKSPACE_COLOR = '#8B5CF6'
export const DEFAULT_WORKSPACE_ICON = 'wallet'
