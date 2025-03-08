import mongoose, { Document, Schema } from "mongoose";

export interface IStory extends Document {
  story_id: number;
  book_based_story: string;
  plot: string;
  story_telling_inspiration: string;
  createdAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    story_id: {
      type: Number,
      required: true,
      unique: true,
    },
    book_based_story: {
      type: String,
      required: true,
    },
    plot: {
      type: String,
      required: true,
    },
    story_telling_inspiration: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Check if the model already exists before creating a new one
const Story =
  mongoose.models.Story || mongoose.model<IStory>("Story", storySchema);

export default Story as mongoose.Model<IStory>;
