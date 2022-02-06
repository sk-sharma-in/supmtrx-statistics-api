import { Router } from "express";
import { StatsController } from "./stats.controller";

const routes = Router();

routes.post(
  "/stats",
  async (req, res, next) => {
    /**
     * Validation logic goes here.
     * Lets assume that the requests to this end point are valid for the sake of simplicity
     */
    next();
  },
  async (req, res, next) => {
    const sd = req.body.statsDefinition;
    const pages = req.body.pages;
    try {
      let statistics = await new StatsController().buildStatistics(sd,pages);
      return res.status(200).json({
        statistics,
      });
    } catch (error) {
      next(error);
    }
  }
);

export { routes };
