/**
 * Using strategy patter to split the statistics type into independent generic strategies
 * This also allows the flexibility to add new strategies for new use cases
 */
export interface IStatsStrategy {
  getStatistics(filter:any, dataSource: any[]);
}
