import { Router } from 'express';
import { signUpController } from './auth.controller';
import { validationSchema } from '../../middleware';
import { signUpUserSchema } from './auth.schema';


const router = Router();

/**
* POST /api/users
*/
router.post('/sign-up', validationSchema(signUpUserSchema), signUpController);


export default router;