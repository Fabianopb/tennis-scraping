export type DesiredSlot = {
  system: 'playfi',
  court: 'tapiola' | 'varisto';
  day: string;
  times: string[];
} | {
  system: 'cintoia',
  court: 'tali' | 'taivalahti';
  day: string;
  times: string[];
};