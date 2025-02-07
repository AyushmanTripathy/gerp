import { Router } from "express";
import authRouter from "./auth";
import studentRouter from "./student/index";
import facultyRouter from "./faculty/index";
import adminRouter from "./admin/index";

const router = Router();

router.use(authRouter);

router.get("/", async (req, res) => {
  res.redirect(res.locals.type);
});

router.use("/admin", adminRouter);
router.use("/student", studentRouter);
router.use("/faculty", facultyRouter);

export default router;
