import { Router } from 'express';

import { validationSchema } from '../../middleware';
import { signInController, signUpController } from './auth.controller';
import { signInUserSchema, signUpUserSchema } from './auth.schema';

const router = Router();

router.post('/sign-up', validationSchema(signUpUserSchema), signUpController);

router.post("/sign-in", validationSchema(signInUserSchema), signInController);

export default router;