import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    task:{
      type: Schema.Types.ObjectId,
      ref: "Task",
    }
  },
  {
    timestamps: true,
  },
);

export const Note = mongoose.model("Note", noteSchema);