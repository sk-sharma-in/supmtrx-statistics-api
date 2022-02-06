import { storage } from "./storage";
import { DateTime } from "luxon";
import axios from "axios";
import { StatsBuilderContext } from "./stats-builder-context";
import { Logger } from "logger";

export class StatsController {
  /**
   * Build all the statistics for the input 'statsDefinition'.
   * Refer stats.def.guide.md for more details
   * @param statsDefinition
   * @returns
   */
  async buildStatistics(statsDefinition: any[], pages?:number[]) {
    try {
      if (statsDefinition.length === 0) {
        throw new Error('No Stats definition found');
      }
      const source = await this.fetchPosts(pages);

      //Stats builder context for orchestration of the all stats strategy
      const statsContext = new StatsBuilderContext();
      const statistics = await Promise.all(
        statsDefinition.flatMap(async (def) => {
          return statsContext.getStatistics(def, source);
        })
      );
      return statistics;
    } catch (error) {
      Logger.error({ error }, "Error in builduing Stats");
      throw new Error(error.toString() || "Error in builduing Stats");
    }
  }

  /**
   * Registering token for basic auth of the Supermetrics API
   * @returns
   */
  private async registerToken() {
    try {
      const existing_token = await storage.get("sl_token");
      if (existing_token) {
        //Check if the previously registered token is present and valid
        return existing_token;
      } else {
        //Get new token registered
        const authURI = "https://api.supermetrics.com/assignment/register";
        const token = (
          await axios({
            method: "POST",
            url: authURI,
            data: {
              client_id: "ju16a6m81mhid5ue1z3v2g0uh",
              email: "your@email.address",
              name: "Your Name",
            },
          })
        ).data["data"]["sl_token"];
        await storage.set("sl_token", token);
        return token;
      }
    } catch (error) {
      Logger.error({ error }, "Error in registering the auth token");
      throw  error.toString() || "Error in registering the auth token");
    }
  }

  /**
   * Fetching posts from the fictional Supermetrics API
   * @returns
   */
  private async fetchPosts(pages?:number[]) {
    try {
      if(!pages) {
        pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
      const postURI = "https://api.supermetrics.com/assignment/posts";
      const sl_token = await this.registerToken();
      let results = await Promise.all(
        pages.map(async (page) => {
          const postsData = await axios({
            method: "GET",
            url: postURI,
            params: {
              sl_token,
              page,
            },
          });
          return postsData.data["data"]["posts"];
        })
      );

      return results
        .reduce((flatArray, result) => flatArray.concat(result), [])
        .map((item) => {
          // item['created_time_units'] = this.getUnitsFromISODate(item.created_time);
          return { ...item, ...this.getUnitsFromISODate(item.created_time) };
        });
    } catch (error) {
      Logger.error({ error }, "Error in fetching the POSTS");
      throw new Error(error.toString() || "Error in fetching the POSTS");
    }
  }

  /**
   * Return units of an ISO date
   * @param isoDate
   * @returns {month,weekDay,day,weekNumber,year}
   */
  private getUnitsFromISODate(isoDate: string): {
    month: number;
    weekNumber: number;
    day: number;
    weekDay: number;
    year: number;
  } {
    const dt = DateTime.fromISO(isoDate);
    if (!dt.isValid) {
      throw new Error("Invalid date");
    }
    return {
      month: dt.month,
      weekNumber: dt.weekNumber,
      day: dt.day,
      weekDay: dt.weekday,
      year: dt.year,
    };
  }
}
