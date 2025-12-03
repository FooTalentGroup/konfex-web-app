import { z } from "zod";

// Roles en un solo lugar (SSOT)
export const userRoles = ["USER", "ADMIN"] as const;
export type UserRole = (typeof userRoles)[number];

// Schema de validación
export const signUpUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        error: (issue) => (issue.input === undefined ? "Formato Inválido" : "El email es inválido"),
      })
      .email("Email inválido")
      .min(1, { message: "El email es obligatorio" })
      .toLowerCase()
      .trim(),

    name: z
      .union([z.string(), z.null(), z.undefined()])
      .transform((val) => {
        if (typeof val === "string") {
          const trimmed = val.trim();
          return trimmed === "" ? null : trimmed;
        }
        return val ?? null;
      })
      .pipe(z.union([z.string().min(1, { message: "El nombre no puede estar vacío" }), z.null()]))
      .default(null),

    role: z.enum(userRoles).default("USER"),

    password: z
      .string({
        error: (issue) =>
          issue.input === undefined ? "La contraseña es obligatoria" : "La contraseña es inválida",
      })
      .min(8, "Mínimo 8 caracteres")
      .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Debe incluir letras y números"),
  }),
});

export type UserSignUpRequestDto = z.infer<typeof signUpUserSchema>["body"];

export const signInUserSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  }),
});

export type UserSignInRequestDto = z.infer<typeof signInUserSchema>["body"];
