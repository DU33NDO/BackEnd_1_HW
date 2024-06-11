import { CreateEventDto } from "./dtos/CreateEvent.dot";
import { Event } from "./types/response";
import EventModel, { IEvent } from "../../src/auth/models/Model";

class EventService {
  async getEventById(id: string): Promise<IEvent | null> {
    return await EventModel.findById(id).exec();
  }

  async getEvents(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: "asc" | "desc"
  ): Promise<IEvent[]> {
    const skip = (page - 1) * pageSize;
    const sortOption: { [key: string]: 1 | -1 } = sortBy
      ? { [sortBy]: sortDirection === "desc" ? -1 : 1 }
      : {};
    return await EventModel.find()
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .exec();
  }

  async getEventsByCity(city: string): Promise<IEvent[]> {
    return await EventModel.find({ city }).exec();
  }

  async createEvent(eventDto: CreateEventDto): Promise<IEvent> {
    const newEvent = new EventModel({
      name: eventDto.name,
      description: eventDto.description,
      date: new Date(eventDto.date),
      location: eventDto.location,
      duration: eventDto.duration,
      city: eventDto.city,
    });
    return await newEvent.save();
  }
}

export default EventService;
