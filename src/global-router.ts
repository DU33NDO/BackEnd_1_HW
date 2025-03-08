import { Router } from "express";
import storyRouter from "./routes/storyRoutes";
// other routers can be imported here

const globalRouter = Router();

globalRouter.use(storyRouter);

// other routers can be added here

export default globalRouter;
