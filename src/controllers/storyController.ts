import { Request, Response } from "express";
import Story from "../models/Story";
import storyService from "../services/storyService";

/**
 * Controller for handling story-related requests
 */
class StoryController {
  /**
   * Generate a new story
   */
  async generateStory(req: Request, res: Response): Promise<void> {
    try {
      const { quote, bookBasedStory, storyTellingInspiration } = req.body;

      if (!quote || typeof quote !== "string") {
        res.status(400).json({
          success: false,
          storyParts: ["Invalid input provided."],
        });
        return;
      }

      // Get existing plots for duplicate checking
      const existingStories = await Story.find({}, "plot");
      const existingPlots = existingStories.map((story) => story.plot);

      // Generate the story
      const result = await storyService.generateStory(
        quote,
        existingPlots,
        bookBasedStory,
        storyTellingInspiration
      );

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      try {
        // Get the count for the new story_id
        const storyCount = await Story.countDocuments();

        const newStory = new Story({
          story_id: storyCount + 1,
          book_based_story: bookBasedStory || result.storyParts?.join(" "),
          plot: result.plot,
          story_telling_inspiration:
            storyTellingInspiration || "Hannibal Lecter",
        });

        await newStory.save();

        // Add the story_id to the result
        result.storyId = newStory.story_id;

        res.status(201).json(result);
      } catch (error) {
        console.error("Error saving story to database:", error);

        // Return the story even if saving to DB failed
        res.status(201).json({
          ...result,
          dbError: "Story generated but not saved to database",
        });
      }
    } catch (error) {
      console.error("Controller error generating story:", error);
      res.status(500).json({
        success: false,
        storyParts: [
          "The whispers grow louder as the darkness deepens. Soon, you'll understand the meaning behind these words. Soon, you'll see what lies beneath the surface.",
        ],
      });
    }
  }

  async getAllStories(req: Request, res: Response): Promise<void> {
    try {
      const stories = await Story.find();

      res.status(200).json({
        success: true,
        stories: stories.map((story) => ({
          story_id: story.story_id.toString(),
          plot: story.plot,
          book_based_story: story.book_based_story,
          story_telling_inspiration: story.story_telling_inspiration,
          createdAt: story.createdAt,
        })),
      });
    } catch (error) {
      console.error("Failed to load stories:", (error as Error).message);
      res.status(500).json({
        success: false,
        stories: [],
        message: "Failed to load stories",
      });
    }
  }

  /**
   * Get a story by ID
   */
  async getStoryById(req: Request, res: Response): Promise<void> {
    try {
      const storyId = parseInt(req.params.id);

      if (isNaN(storyId)) {
        res.status(400).json({
          success: false,
          story: null,
          message: "Invalid story ID",
        });
        return;
      }

      const story = await Story.findOne({ story_id: storyId }).lean();

      if (!story) {
        res.status(404).json({
          success: false,
          story: null,
          message: "Story not found",
        });
        return;
      }

      res.status(200).json({ success: true, story });
    } catch (error) {
      console.error(`Error retrieving story #${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        story: null,
        message: "Error retrieving story",
      });
    }
  }
}

export default new StoryController();
