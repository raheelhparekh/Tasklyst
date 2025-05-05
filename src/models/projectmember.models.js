import mongoose from "mongoose";
import {AvailableUserRolesEnum, UserRolesEnums} from "../utils/constants.js"

const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.Objectid,
      ref: "User",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role:{
        type:String,
        enum:AvailableUserRolesEnum,
        default:UserRolesEnums.MEMBER
    }
  },
  {
    timestamps: true,
  },
);

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
