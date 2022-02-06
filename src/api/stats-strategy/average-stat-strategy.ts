import { Logger } from "../../logger";
import { IStatsStrategy } from "./stats-strategy.interface";
import { get } from "lodash";

export class AverageStatsStrategy implements IStatsStrategy {
  /**
   * Get statistics for the type average
   * @param filter 
   * @param dataSource 
   * @returns 
   */
  getStatistics(filter: any, dataSource: any[]) {
    if (filter.type !== "average") {
      throw Error("Invalid stats filter for this strategy");
    }

    // Get all unique values for per_filter in the data source
    const per_filter_values = this.getUniqueValuesForKey(
      filter.per_filter,
      dataSource
    );

    Logger.info({per_filter_values},'Get all unique values for per_filter in the data source');
    
    //Get all unique values for groupBy in the data source
    const groupBy_values = this.getUniqueValuesForKey(
      filter.groupBy,
      dataSource
    );
    Logger.info({groupBy_values},'Get all unique values for groupBy in the data source');
    let results = new Array();
    if (filter.groupBy) {
      groupBy_values.forEach((item) => {
        results.push({
          [filter.groupBy]: item,
          name: filter.name,
          /** Total count of grouped entities / per_filter_value count */
          stats:
            this.getTotalOfFilterON(
              filter.on,
              dataSource.filter((ele) => ele[filter.groupBy] === item)
            ) / per_filter_values.length,
        });
      });
    } else {
      results.push({
        name: filter.name,
        stats:
          this.getTotalOfFilterON(filter.on, dataSource) /
          per_filter_values.length,
      });
    }
    return {[(filter.name).toLowerCase().replace(/ /g,'_')]:results};
  }

  getUniqueValuesForKey(keyPath: string, source: any[]) {
    return [...new Set(source.map((item) => get(item, keyPath)))];
  }

  getTotalOfFilterON(filterONKey: string, source: any[]): number {
    if (filterONKey.split(".").length === 1) {
      return source.filter((item) => item[filterONKey]).length;
    } else {
      // Assuming filterONKey will only contain only .length for now
      return source.reduce((acc, item) => acc + get(item, filterONKey), 0);
    }
  }
}
