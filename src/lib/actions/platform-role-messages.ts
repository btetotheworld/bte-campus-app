export function grantErrorMessage(message: string): string {
  if (message.includes("themselves")) {
    return "You cannot grant a role to yourself.";
  }
  if (message.includes("equal to or above")) {
    return "You cannot grant a role equal to or above your own.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "That person already holds this role.";
  }
  if (message.includes("Only an active")) {
    return "Sign in again, then try granting the role.";
  }
  return "The role could not be granted. Check the person and try again.";
}

export function revokeErrorMessage(message: string): string {
  if (message.includes("last founder")) {
    return "Removing the last founder is blocked.";
  }
  return "The role could not be revoked. Refresh and try again.";
}
