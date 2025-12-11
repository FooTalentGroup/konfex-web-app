import { Router } from "express";

import { validationSchema } from "../../middleware";
import {
  refreshController,
  signInController,
  signOutController,
  signUpController,
} from "./auth.controller";
import { signInUserSchema, signUpUserSchema } from "./auth.schema";

const router = Router();

router.post("/sign-up", validationSchema(signUpUserSchema), signUpController);

router.post("/sign-in", validationSchema(signInUserSchema), signInController);

router.post("/refresh", refreshController);

router.post("/sign-out", signOutController);

export default router;
