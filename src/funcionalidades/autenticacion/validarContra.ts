/**
 * Retorna true si la contraseña es fuerte (>8, mayúscula, minúscula, símbolo).
 */
export function validarContraseña(contraseña: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/.test(contraseña);
}
