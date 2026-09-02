export interface AtomOption {
    id: number;
    atomName: string;
    status: "online" | "offline";
}

export const ATOM_LIST: AtomOption[] = [
    { id: 1, atomName: "esi_qa", status: "online" },
    { id: 2, atomName: "Esi_Prod", status: "offline" },
    { id: 3, atomName: "Esi_stagging", status: "online" },
    { id: 4, atomName: "Esi_Test", status: "online" },
];
