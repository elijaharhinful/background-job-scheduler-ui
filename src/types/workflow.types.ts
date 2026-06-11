export interface WorkflowNode {
  id:           string;
  type:         string;
  status:       string;
  dependsOn:    string[];
  position?:    { x: number; y: number };
}
