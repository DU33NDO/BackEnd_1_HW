import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  duration: string;
  city: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  city: { type: String },
});
const EventModel = mongoose.model<IEvent>("Event", UserSchema);
export default EventModel;
