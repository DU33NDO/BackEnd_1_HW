import { Request, Response } from "express";
import { CreateEventDto } from "./dtos/CreateEvent.dot";
import EventService from "./event-service";

class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

  createEvent = async (req: Request, res: Response) => {
    try {
      const event: CreateEventDto = req.body;
      const newEvent = await this.eventService.createEvent(event);
      res.status(201).json(newEvent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getEvents = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sortBy = (req.query.sortBy as string) || "date";
      const sortDirection = (req.query.sortDirection as string) || "asc";
      const events = await this.eventService.getEvents(
        page,
        pageSize,
        sortBy as string,
        sortDirection as "asc" | "desc"
      );
      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
      } else {
        res.status(200).json(event);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getEventByCity = async (req: Request, res: Response) => {
    try {
      const { city } = req.params;
      const events = await this.eventService.getEventsByCity(city);
      if (!events || events.length === 0) {
        res.status(404).json({ error: "Events not found in this city" });
      } else {
        res.status(200).json(events);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default EventController;
