import { Logger } from "../logger";
import { AbsoluteStatsStrategy } from "./stats-strategy/absolute-stat-strategy";
import { AverageStatsStrategy } from "./stats-strategy/average-stat-strategy";
import { IStatsStrategy } from "./stats-strategy/stats-strategy.interface";

enum StatsStrategyType {
  ABSOLUTE_MAX = "absolute_max",
  ABSOLUTE_MIN = "absolute_min",
  ABSOLUTE_TOTAL = "absolute_total",
  AVERAGE = "average",
}
export class StatsBuilderContext {
  private statsStrategyMap: Map<StatsStrategyType, IStatsStrategy>;
  constructor() {
    this.statsStrategyMap = new Map<StatsStrategyType, IStatsStrategy>();
    this.context();
  }

  /**
   * Execute the strategy based on the input 'statsFilter'
   * Return the statistics
   * @param statsFilter 
   * @param source 
   * @returns 
   */
  public async getStatistics(statsFilter: any, source: any[]) {
    Logger.info({ statsFilter }, "Executing Statistics Strategy");
    return await this.statsStrategyMap
      .get(statsFilter.type)
      .getStatistics(statsFilter, source);
  }

  private context() {
    this.statsStrategyMap.set(
      StatsStrategyType.ABSOLUTE_MAX,
      new AbsoluteStatsStrategy()
    );
    this.statsStrategyMap.set(
      StatsStrategyType.ABSOLUTE_MIN,
      new AbsoluteStatsStrategy()
    );
    this.statsStrategyMap.set(
      StatsStrategyType.ABSOLUTE_TOTAL,
      new AbsoluteStatsStrategy()
    );
    this.statsStrategyMap.set(
      StatsStrategyType.AVERAGE,
      new AverageStatsStrategy()
    );
  }
}
