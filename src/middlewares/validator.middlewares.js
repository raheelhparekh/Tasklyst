import { validationResult } from "express-validator";
import {ApiError} from "../utils/api-errors.js"

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  console.log("errors occured", errors.array())

  // no errors move forward
  if (errors.isEmpty) {
    return next();
  }

  // errors exist ?
  const extractedArray = [];

  errors.array().map((err) =>
    extractedArray.push({
      [err.path]: err.msg
    }),
  );

  throw new ApiError(422,"Errors occured while validating",extractedArray)
};
