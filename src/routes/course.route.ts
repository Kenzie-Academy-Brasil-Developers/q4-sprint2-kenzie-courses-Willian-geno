import { Router } from "express";
import { courseController } from "../controllers";
import { validateSchema, validateToken, verifyPermission } from "../middlewares";
import { courseSchema, courseUpdateSchema } from "../schemas";

const courseRouter = Router();

courseRouter.get("/courses", validateToken, courseController.readAll);
courseRouter.post(
  "/courses",
  validateToken,
  validateSchema(courseSchema),
  verifyPermission,
  courseController.createCourse
);
courseRouter.post("/courses/:id/users",
//validateToken,
//verifyPermission,
courseController.userCourses
) 
courseRouter.patch(
  "/courses/:id",
  validateToken,
  verifyPermission,
  validateSchema(courseUpdateSchema),
  courseController.updateCourse
);

export default courseRouter;
