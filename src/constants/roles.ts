export interface RoleData {
    id: number;
    roleName: string;
    description: string;
}

export const INITIAL_ROLES: RoleData[] = [
    { id: 1, roleName: "Admin", description: "Full access across all modules." },
    { id: 2, roleName: "User", description: "Standard access with restricted permissions." },
];
