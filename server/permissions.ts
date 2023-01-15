export const PERMS = {
    None: 0,
    Admin: 1,

    ViewInv: 1 << 1,
    EditInv: 1 << 2,

    ViewStor: 1 << 3,
    EditStor: 1 << 4,

    ViewUsrs: 1 << 5,
    EditUsrs: 1 << 6,

    RequestAppmnts: 1 << 7,
    ViewAppmnts: 1 << 8,
    EditAppmnts: 1 << 9,

    ViewChecklists: 1 << 10,
    EditChecklists: 1 << 11
}