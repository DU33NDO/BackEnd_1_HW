import { Router } from "express";
import EventController from "./event-controller";
import EventService from "./event-service";
import { authMiddleware } from "../middlewares/auth-middleware";

const eventRouter = Router();

const eventService = new EventService();
const eventController = new EventController(eventService);

eventRouter.get("/events/all", authMiddleware, eventController.getEvents);
eventRouter.get("/events/city/:city", eventController.getEventByCity);
eventRouter.post("/events/", eventController.createEvent);
eventRouter.get("/events/:id", eventController.getEventById);

export default eventRouter;
