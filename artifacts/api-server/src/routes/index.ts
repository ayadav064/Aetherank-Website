import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import blogRouter from "./blog";
import submissionsRouter from "./submissions";
import statsRouter from "./stats";
import analyticsRouter from "./analytics";
import sitemapRouter from "./sitemap";
import newsletterRouter from "./newsletter";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(blogRouter);
router.use(submissionsRouter);
router.use(statsRouter);
router.use(analyticsRouter);
router.use(newsletterRouter);
router.use(storageRouter);

export { sitemapRouter };
export default router;
