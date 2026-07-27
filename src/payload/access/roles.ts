import type { Access, FieldAccess, PayloadRequest } from "payload";

export type UserRole = "admin" | "editor";

type UserWithRole = {
  role?: UserRole | null;
};

export function getUserRole(user: PayloadRequest["user"]): UserRole | null {
  if (!user) return null;

  // Users created before roles were introduced are admins. The migration
  // persists that default, while this fallback avoids a deployment lockout.
  return (user as UserWithRole).role === "editor" ? "editor" : "admin";
}

export function userIsAdmin(user: PayloadRequest["user"]): boolean {
  return getUserRole(user) === "admin";
}

export function userCanEditContent(user: PayloadRequest["user"]): boolean {
  const role = getUserRole(user);
  return role === "admin" || role === "editor";
}

export const adminOnly: Access = ({ req }) => userIsAdmin(req.user);

export const adminsAndEditors: Access = ({ req }) =>
  userCanEditContent(req.user);

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const authenticatedOrPublished: Access = ({ req }) => {
  if (req.user) return true;

  return {
    _status: {
      equals: "published",
    },
  };
};

export const adminOnlyField: FieldAccess = ({ req }) => userIsAdmin(req.user);
