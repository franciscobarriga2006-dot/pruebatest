import { z } from "zod";

export const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

export const validateRut = (rut: string): boolean => {
  if (!rutRegex.test(rut)) return false;

  const cleanRut = rut.replace(/\./g, "").replace("-", "");
  const rutNumber = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const expectedVerifier =
    remainder === 0 ? "0" : remainder === 1 ? "K" : (11 - remainder).toString();

  return verifier === expectedVerifier;
};

// Login → usa correo + contraseña
export const loginSchema = z.object({
  correo: z.string().email("Debe ser un correo válido"),
  contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

// Registro
export const registerSchema = z
  .object({
    rut: z.string().min(1, "El RUT es requerido").refine(validateRut, "RUT inválido. Formato: 11.111.111-0"),
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "El nombre no puede exceder 50 caracteres"),
    email: z.string().email("Por favor ingresa un email válido"),
    contrasena: z.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una mayúscula, una minúscula y un número"),
    confirmcontrasena: z.string(),
    region: z.string().min(1, "Seleccione una región"),
    comuna: z.string().min(2, "La comuna debe tener al menos 2 caracteres").max(60, "La comuna no puede exceder 60 caracteres"),
    ciudad: z.string().min(2, "La ciudad debe tener al menos 2 caracteres").max(60, "La ciudad no puede exceder 60 caracteres"),
    direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres").max(255, "La dirección no puede exceder 255 caracteres"),
  })
  .refine((data) => data.contrasena === data.confirmcontrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmcontrasena"],
  });


// Solicitud de reseteo de contraseña → usa solo correo
export const requestResetSchema = z.object({
  correo: z.string().email("Debe ser un correo válido"),
});

// Reset con token
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "El token es requerido"),
    contrasena: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
    confirmarContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });
// ---- Tipos inferidos ----
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestResetInput = z.infer<typeof requestResetSchema>; // Ahora esto funcionará
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;