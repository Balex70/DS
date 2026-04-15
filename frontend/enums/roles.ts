export const availableRoles = [
  "admin",
  "editor",
] as const

export type Role = typeof availableRoles[number]
