import { Router } from "express";
import storyController from "../controllers/storyController";

const storyRouter = Router();

storyRouter.post("/", storyController.generateStory);
storyRouter.get("/", storyController.getAllStories);
storyRouter.get("/:id", storyController.getStoryById);

export default storyRouter;
