import { Logger } from "../../logger";
import { IStatsStrategy } from "./stats-strategy.interface";
import { get } from "lodash";

export class AbsoluteStatsStrategy implements IStatsStrategy {
  /**
   * Get statistics for the type = absolute_max | absolute_min | absolute_total
   * @param filter
   * @param dataSource
   * @returns
   */
  getStatistics(filter: any, dataSource: any[]) {
    if (
      filter.type !== "absolute_max" &&
      filter.type !== "absolute_min" &&
      filter.type !== "absolute_total"
    ) {
      throw Error("Invalid stats filter for this strategy");
    }

    // Get all unique values for per_filter in the data source
    const per_filter_values = this.getUniqueValuesForKey(
      filter.per_filter,
      dataSource
    );
    Logger.info(
      { per_filter_values },
      "Get all unique values for per_filter in the data source"
    );
    //Get all unique values for groupBy in the data source
    const groupBy_values = this.getUniqueValuesForKey(
      filter.groupBy,
      dataSource
    );
    Logger.info(
      { groupBy_values },
      "Get all unique values for groupBy in the data source"
    );
    let results = new Array();
    if (filter.groupBy) {
      groupBy_values.forEach((grp) => {
        let _stat = {
          [filter.groupBy]: grp,
          name: filter.name,
          stats: [],
        };
        per_filter_values.forEach((per) => {
          _stat.stats.push({
            [filter.per_filter]: per,
            stats: this.getAsoluteStats(
              filter.on,
              dataSource.filter(
                (ele) =>
                  ele[filter.groupBy] === grp && ele[filter.per_filter] === per
              ),
              filter.type
            ),
          });
        });
        results.push(_stat);
      });
    } else {
      per_filter_values.forEach((item) => {
        results.push({
          [filter.per_filter]: item,
          name: filter.name,
          stats: this.getAsoluteStats(
            filter.on,
            dataSource.filter((ele) => ele[filter.per_filter] === item),
            filter.type
          ),
        });
      });
    }
    return { [filter.name.toLowerCase().replace(/ /g, "_")]: results };
  }

  getUniqueValuesForKey(keyPath: string, source: any[]) {
    return [...new Set(source.map((item) => get(item, keyPath)))];
  }

  getAsoluteStats(
    filterONKey: string,
    source: any[],
    type: string
  ): { value: number; post: any } {
    let result = { value: 0, post: undefined };
    switch (type) {
      case "absolute_max": {
        for (let i = 0; i < source.length; i++) {
          if (result.value <= get(source[i], filterONKey)) {
            result.value = get(source[i], filterONKey);
            result.post = source[i];
          }
        }
        return result;
      }
      case "absolute_min": {
        for (let i = 0; i < source.length; i++) {
          if (result.value >= get(source[i], filterONKey)) {
            result.value = get(source[i], filterONKey);
            result.post = source[i];
          }
        }
        return result;
      }
      case "absolute_total": {
        result.value = source.length;
        return result;
      }
    }
  }
}
