import type { Feature, Polygon } from 'geojson';

export interface BuildingProperties {
  id: string;
  name_en: string;
  name_zh: string;
  height: number;
  category: string;
  departments: string[];
  description: string;
  has_floors: boolean;
  building_area: number;
  year_built: number;
  floor_count: number;
  annual_energy: number;
  annual_carbon: number;
  carbon_capture: number;
  [key: string]: unknown;
}

export interface FloorProperties {
  building_id: string;
  floor: number;
  floor_name: string;
  base_height: number;
  top_height: number;
  departments: string[];
  description: string;
  [key: string]: unknown;
}

export type BuildingFeature = Feature<Polygon, BuildingProperties>;
export type FloorFeature = Feature<Polygon, FloorProperties>;

export interface FieldMeta {
  label: string;
  showInTooltip: boolean;
  order: number;
  unit?: string;
}

export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
}
