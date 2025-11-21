import { Router } from 'express';
import { signInController, signUpController } from './auth.controller';
import { validationSchema } from '../../middleware';
import { signInUserSchema, signUpUserSchema } from './auth.schema';


const router = Router();

/**
 * @swagger
 * /api/v1/auth/sign-up:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Auth]
 *     description: >
 *       Crea un nuevo usuario en el sistema.  
 *       Valida email, nombre, contraseña y rol.  
 *       Cualquier usuario puede registrarse, pero solo ADMIN puede asignar rol ADMIN.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               name:
 *                 type: string
 *                 example: "Test User"
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 default: USER
 *                 example: ADMIN
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Debe incluir letras y números
 *                 example: "test123#"
 *
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     name:
 *                       type: string
 *                       example: "Test User"
 *                     role:
 *                       type: string
 *                       example: USER
 *
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El email es obligatorio"
 *
 *       409:
 *         description: El usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El usuario ya existe"
 */
router.post('/sign-up', validationSchema(signUpUserSchema), signUpController);

/**
 * @swagger
 * /api/v1/auth/sign-in:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Users]
 *     description: Permite iniciar sesión con email y contraseña. Se validan credenciales contra la base de datos; el email debe ser un string con formato válido y la contraseña debe tener al menos 8 caracteres combinando letras y números.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico registrado. Se recomienda enviar en minúsculas.
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 pattern: '^(?=.*[A-Za-z])(?=.*\\d).+$'
 *                 description: Se espera al menos 8 caracteres, con letras y números.
 *                 example: "Passw0rd123"
 *           example:
 *             email: "test@example.com"
 *             password: "Passw0rd123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Login exitoso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT válido por 7 días.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: "test@example.com"
 *                         name:
 *                           type: string
 *                           nullable: true
 *                           example: "Miguel"
 *                         role:
 *                           type: string
 *                           enum: [USER, ADMIN]
 *                           example: "ADMIN"
 *       400:
 *         description: Datos enviados inválidos (faltan campos obligatorios o formato incorrecto).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               badRequest:
 *                 summary: Campos obligatorios ausentes
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Datos de login inválidos"
 *                   errors:
 *                     - "El email es obligatorio"
 *                     - "La contraseña debe tener al menos 8 caracteres e incluir letras y números"
 *       401:
 *         description: Credenciales inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *       403:
 *         description: Acceso denegado para cuentas bloqueadas o sin permisos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               forbidden:
 *                 summary: Cuenta bloqueada
 *                 value:
 *                   success: false
 *                   statusCode: 403
 *                   message: "Tu cuenta está bloqueada temporalmente"
 *       500:
 *         description: Error inesperado en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 summary: Falla del servidor
 *                 value:
 *                   success: false
 *                   statusCode: 500
 *                   message: "Error inesperado en el login"
 */
router.post("/sign-in", validationSchema(signInUserSchema), signInController);


export default router;