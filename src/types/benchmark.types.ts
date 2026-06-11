export interface BenchmarkResult {
  heapInsertMs: number;
  heapExtractMs: number;
  timingWheelInsertMs: number;
  timingWheelExtractMs: number;
  heapMemoryMb: number;
  timingWheelMemoryMb: number;
  totalJobs: number;
  timestamp: string;
}
