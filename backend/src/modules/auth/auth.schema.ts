import { z } from "zod";

// Roles en un solo lugar (SSOT)
export const userRoles = ["USER", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];

// Schema de validación
export const signUpUserSchema = z.object({
  body: z.object({
    email: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Formato Inválido"
          : "El email es inválido",
    })
    .email("Email inválido")
    .min(1, { message: "El email es obligatorio" })
    .toLowerCase()
    .trim(),

    name: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "El nombre es obligatorio"
          : "El nombre es inválido",
    }).min(1, { message: "El nombre no puede estar vacío" }),

    role: z.enum(userRoles).default("USER"),

    password: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "La contraseña es obligatoria"
          : "La contraseña es inválida",
    })
    .min(8, "Mínimo 8 caracteres")
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Debe incluir letras y números"),
  }),
});

// DTO generado automáticamente
export type UserSignUpRequestDto = z.infer<typeof signUpUserSchema>["body"];
