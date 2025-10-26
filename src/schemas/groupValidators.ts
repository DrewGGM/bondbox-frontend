import {
  createGroupSchema,
  joinGroupByCodeSchema,
  groupIdSchema,
  invitationIdSchema,
  renameGroupSchema,
  createInvitationSchema,
  acceptJoinSolicitationSchema,
  createRoleSchema,
  reassignRoleSchema,
} from './groupSchemas';
import { validate } from './validator';

/**
 * Validate create group data
 * @param name - Group name
 * @returns Validated group name
 * @throws ValidationError if validation fails
 */
export const validateCreateGroup = (name: unknown): string => {
  const validated = validate(createGroupSchema, { name });
  return validated.name;
};

/**
 * Validate join group by code data
 * @param code - Group join code
 * @returns Validated code
 * @throws ValidationError if validation fails
 */
export const validateJoinGroupByCode = (code: unknown): string => {
  const validated = validate(joinGroupByCodeSchema, { code });
  return validated.code;
};

/**
 * Validate group ID
 * @param groupId - Group ID
 * @returns Validated group ID
 * @throws ValidationError if validation fails
 */
export const validateGroupId = (groupId: unknown): string => {
  const validated = validate(groupIdSchema, { groupId });
  return validated.groupId;
};

/**
 * Validate invitation ID
 * @param invitationId - Invitation ID
 * @returns Validated invitation ID
 * @throws ValidationError if validation fails
 */
export const validateInvitationId = (invitationId: unknown): string => {
  const validated = validate(invitationIdSchema, { invitationId });
  return validated.invitationId;
};

/**
 * Validate rename group data
 * @param data - Rename group data
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validateRenameGroup = (data: unknown) => {
  return validate(renameGroupSchema, data);
};

/**
 * Validate create invitation data
 * @param data - Create invitation data
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validateCreateInvitation = (data: unknown) => {
  return validate(createInvitationSchema, data);
};

/**
 * Validate accept join solicitation data
 * @param data - Accept join solicitation data
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validateAcceptJoinSolicitation = (data: unknown) => {
  return validate(acceptJoinSolicitationSchema, data);
};

/**
 * Validate create role data
 * @param data - Create role data
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validateCreateRole = (data: unknown) => {
  return validate(createRoleSchema, data);
};

/**
 * Validate reassign role data
 * @param data - Reassign role data
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validateReassignRole = (data: unknown) => {
  return validate(reassignRoleSchema, data);
};
