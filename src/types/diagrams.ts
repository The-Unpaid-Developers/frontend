// export interface SystemDependencyDiagramData {
//   nodes: Array<{
//     id: string; // system code
//     name: string; // system name
//     type: string; // system type
//     criticality: string; // system criticality
//     internetFacing: string; // internet facing status
//     environment: string; // system environment
//     url: string; // system URL
//   }>;
//   links: Array<{
//     source: string; // source system
//     target: string; // target system
//     pattern: string; // connection pattern
//     frequency: string; // connection frequency
//     role: string; // role in the connection, dont need??
//     description?: string; // optional description
//     value?: number; // connection count
//   }>;
//   metadata: {
//     code: string;
//     review: string;
//     integrationMiddleware: string[];
//     generatedDate: string;
//   };
// }

export interface Node {
  id: string;
  name: string;
  type: string;
  criticality: string;
  url?: string;
}

export interface Link {
  source: string;
  target: string;
  pattern: string;
  frequency: string;
  role: string;
  value?: number;
}

export interface Metadata {
  code: string;
  review: string;
  integrationMiddleware: string[];
  generatedDate: string;
}

export interface SankeyData {
  nodes: Node[];
  links: Link[];
  metadata: Metadata;
}

export interface FilterState {
  systemSearch: string;
  systemType: string;
  connectionType: string;
  criticality: string;
  frequency: string;
  role: string;
}

export interface ProcessedNode extends Node {
  layer?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  sourceLinks?: ProcessedLink[];
  targetLinks?: ProcessedLink[];
}

export interface ProcessedLink {
  source: ProcessedNode;
  target: ProcessedNode;
  pattern: string;
  frequency: string;
  role: string;
  value?: number;
  width?: number;
}

export interface LegendItem {
  color: string;
  label: string;
}