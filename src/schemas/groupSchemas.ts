import { z } from 'zod';

/**
 * Create Group Schema
 */
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del grupo es requerido')
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
});

/**
 * Join Group By Code Schema
 */
export const joinGroupByCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'El código de grupo es requerido')
    .length(12, 'El código debe tener exactamente 12 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'El código solo puede contener letras, números y guiones'),
});

/**
 * Group ID Schema (for leave, delete, etc.)
 */
export const groupIdSchema = z.object({
  groupId: z
    .string()
    .min(1, 'El ID del grupo es requerido')
    .uuid('Formato de ID de grupo inválido'),
});

/**
 * Invitation ID Schema
 */
export const invitationIdSchema = z.object({
  invitationId: z
    .string()
    .min(1, 'El ID de la invitación es requerido')
    .uuid('Formato de ID de invitación inválido'),
});

/**
 * Rename Group Schema
 */
export const renameGroupSchema = z.object({
  idGroup: z
    .string()
    .min(1, 'El ID del grupo es requerido')
    .uuid('Formato de ID de grupo inválido'),
  name: z
    .string()
    .min(1, 'El nombre del grupo es requerido')
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
});

/**
 * Create Invitation Schema
 */
export const createInvitationSchema = z.object({
  expiresIn: z
    .union([
      z.instanceof(Date),
      z.string().transform((str) => new Date(str))
    ])
    .refine((date) => {
      return date > new Date();
    }, {
      message: 'La fecha de expiración debe ser en el futuro',
    })
    .refine((date) => {
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1); // Max 1 year in the future
      return date <= maxDate;
    }, {
      message: 'La fecha de expiración no puede ser mayor a 1 año',
    }),
  toUser: z
    .string()
    .min(1, 'El ID del usuario es requerido'),
  idGroup: z
    .string()
    .min(1, 'El ID del grupo es requerido')
    .uuid('Formato de ID de grupo inválido'),
  initialRol: z
    .string()
    .min(1, 'El ID del rol es requerido')
    .uuid('Formato de ID de rol inválido'),
});

/**
 * Accept Join Solicitation Schema
 */
export const acceptJoinSolicitationSchema = z.object({
  id: z
    .string()
    .min(1, 'El ID de la solicitud es requerido')
    .uuid('Formato de ID de solicitud inválido'),
  rolId: z
    .string()
    .min(1, 'El ID del rol es requerido')
    .uuid('Formato de ID de rol inválido'),
});

/**
 * Create Role Schema
 */
export const createRoleSchema = z.object({
  idGroup: z
    .string()
    .min(1, 'El ID del grupo es requerido')
    .uuid('Formato de ID de grupo inválido'),
  rolName: z
    .string()
    .min(1, 'El nombre del rol es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(30, 'El nombre no puede exceder 30 caracteres')
    .regex(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
  permsCongig: z.object({
    invitePeople: z.boolean(),
    kickPeople: z.boolean(),
    createTask: z.boolean(),
    deleteTask: z.boolean(),
    updateTask: z.boolean(),
    createInventory: z.boolean(),
    deleteInventory: z.boolean(),
    updateInventory: z.boolean(),
    createFinances: z.boolean(),
    deleteFinances: z.boolean(),
    updateFinances: z.boolean(),
    createRol: z.boolean(),
    editable: z.boolean(),
    updateRol: z.boolean(),
  }),
});

/**
 * Reassign Role Schema
 */
export const reassignRoleSchema = z.object({
  to: z
    .string()
    .min(1, 'El ID del usuario es requerido'),
  rolId: z
    .string()
    .min(1, 'El ID del rol es requerido')
    .uuid('Formato de ID de rol inválido'),
  groupId: z
    .string()
    .min(1, 'El ID del grupo es requerido')
    .uuid('Formato de ID de grupo inválido'),
});

// Export types inferred from schemas
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;
export type JoinGroupByCodeSchemaType = z.infer<typeof joinGroupByCodeSchema>;
export type GroupIdSchemaType = z.infer<typeof groupIdSchema>;
export type InvitationIdSchemaType = z.infer<typeof invitationIdSchema>;
export type RenameGroupSchemaType = z.infer<typeof renameGroupSchema>;
export type CreateInvitationSchemaType = z.infer<typeof createInvitationSchema>;
export type AcceptJoinSolicitationSchemaType = z.infer<typeof acceptJoinSolicitationSchema>;
export type CreateRoleSchemaType = z.infer<typeof createRoleSchema>;
export type ReassignRoleSchemaType = z.infer<typeof reassignRoleSchema>;
