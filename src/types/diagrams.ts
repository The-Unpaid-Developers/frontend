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

// Overall Systems Diagram
export interface OverallSystemsDiagNode {
  id: string;
  name: string;
  type: string;
  criticality: string;
}

export interface OverallSystemsDiagLink {
  source: OverallSystemsDiagNode;
  target: OverallSystemsDiagNode;
  count: string;
}

export interface OverallSystemsDiagData {
  nodes: OverallSystemsDiagNode[];
  links: OverallSystemsDiagLink[];
  metadata: Metadata;
}

export interface OverallSystemsDiagFilterState {
  systemSearch: string;
  systemType: string;
  criticality: string;
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
  middleware?: string;
  value?: number;
  width?: number;
}

export interface LegendItem {
  color: string;
  label: string;
}


// Paths 
export interface PathNode {
  id: string;
  name: string;
  type: string;
  criticality: string;
  url?: string;
}

export interface PathLink {
  source: string;
  target: string;
  pattern: string;
  frequency: string;
  role: string;
  value?: number;
}

export interface PathMetadata {
  producerSystem: string;
  consumerSystem: string;
  integrationMiddleware: string[];
  generatedDate: string;
}

export interface PathSankeyData {
  nodes: PathNode[];
  links: PathLink[];
  metadata: PathMetadata;
}

// Business Capabilities
export interface BusinessCapability {
  id: string;
  name: string;
  level: string;
  systemCode: string;
  parentId: string | null;
  systemCount?: number | null;
  metadata?: {
    systemCode: string;
    projectName: string;
    reviewStatus: string;
    approvalStatus: string;
    architect: string;
  };
}

export interface BusinessCapabilitiesData {
  capabilities: BusinessCapability[];
}

export interface HierarchyNode extends d3.HierarchyNode<BusinessCapability> {
  _children?: HierarchyNode[];
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
}