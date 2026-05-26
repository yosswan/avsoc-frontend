import { ModuleEnums } from "./modulesEmuns";
import { PermissionsEnums } from "./permissionsEnum";
import { RoleEnums } from "./rolesEnum";

export const PermissionByRol = [
  {
    role: RoleEnums.LIDER_JUVENIL,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DESACTIVAR_ENTIDAD,
        ],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DESACTIVAR_ENTIDAD,
        ],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DESACTIVAR_ENTIDAD,
        ],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DESACTIVAR_ENTIDAD,
        ],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.EDIT,
          PermissionsEnums.ADD,
        ],
      },

      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.LOAD_SCORE,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          // PermissionsEnums.INSCRIBIR_CLUB,
          PermissionsEnums.VIEW_CLUBES_INSCRITOS,
          PermissionsEnums.LOAD_SCORE,
          // PermissionsEnums.CHECK_CLASIFICATION,
        ],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.VIEW,
          PermissionsEnums.LOAD_SCORE,
          PermissionsEnums.SELECT_TYPE_CAMPOREE,
        ],
      },
    ],
  },
  {
    role: RoleEnums.DIRECTOR,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.EDIT,
        ],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DAR_DE_BAJA_MIEMBRO,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.INSCRIBIR_CLUB_TO_CAMPOREE,
        ],
      },

      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.LOAD_FORMS,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.INSCRIBIR_CLUB,
          PermissionsEnums.VIEW_CLUBES_INSCRITOS,
        ],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.LOAD_FORMS,
          PermissionsEnums.VIEW,
        ],
      },
    ],
  },
  {
    role: RoleEnums.SECRETARIO_CLUB,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.EDIT,
        ],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DAR_DE_BAJA_MIEMBRO,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.INSCRIBIR_CLUB_TO_CAMPOREE,
        ],
      },

      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.LOAD_FORMS,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.INSCRIBIR_CLUB,
          PermissionsEnums.VIEW_CLUBES_INSCRITOS,
        ],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.LOAD_FORMS,
          PermissionsEnums.VIEW,
        ],
      },
    ],
  },
  {
    role: RoleEnums.PASTOR,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.APPROVE_FORM,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.APPROVE_FORM,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.VIEW,
          PermissionsEnums.SELECT_TYPE_CAMPOREE,
        ],
      },
    ],
  },
  {
    role: RoleEnums.ANCIANO,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.APPROVE_FORM,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.APPROVE_FORM,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.VIEW,
          PermissionsEnums.SELECT_TYPE_CAMPOREE,
        ],
      },
    ],
  },
  {
    role: RoleEnums.PERSONA,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [],
      },
    ],
  },
  {
    role: RoleEnums.PRESIDENTE_CONSEJO,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DESACTIVAR_ENTIDAD,
        ],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.CAMPOREE,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },

      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.APPROVE_FORM,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.VIEW_CLUBES_INSCRITOS,
          PermissionsEnums.LOAD_SCORE,
          PermissionsEnums.CHECK_CLASIFICATION,
          PermissionsEnums.INSCRIBIR_CLUB,
        ],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.APPROVE_FORM,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.VIEW,
          PermissionsEnums.SELECT_TYPE_CAMPOREE,
        ],
      },
    ],
  },
  {
    role: RoleEnums.PRESIDENTE_FEDERACION,
    modules: [
      {
        name: ModuleEnums.DISTRITOS,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.FEDERACIONES,
        permissionsActions: [PermissionsEnums.VIEW, PermissionsEnums.DETAIL],
      },
      {
        name: ModuleEnums.IGLESIAS,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.CLUBES,
        permissionsActions: [
          PermissionsEnums.ADD,
          PermissionsEnums.EDIT,
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DESACTIVAR_ENTIDAD,
        ],
      },
      {
        name: ModuleEnums.MIEMBROS,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.DETALLE_MIEMBRO,
        ],
      },
      {
        name: ModuleEnums.FESTIVAL_SJ,
        permissionsActions: [PermissionsEnums.DETAIL, PermissionsEnums.VIEW],
      },
      {
        name: ModuleEnums.EVENTO_PRECAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.APPROVE_FORM,
        ],
      },
      {
        name: ModuleEnums.EVENTO_CAMPOREE,
        permissionsActions: [
          PermissionsEnums.DETAIL,
          PermissionsEnums.VIEW,
          PermissionsEnums.VIEW_CLUBES_INSCRITOS,
          PermissionsEnums.LOAD_SCORE,
          PermissionsEnums.CHECK_CLASIFICATION,
          PermissionsEnums.INSCRIBIR_CLUB,
        ],
      },
      {
        name: ModuleEnums.INFORMES_MENSUALES,
        permissionsActions: [
          PermissionsEnums.APPROVE_FORM,
          PermissionsEnums.VIEW_DATA_FORMS,
          PermissionsEnums.VIEW,
        ],
      },
    ],
  },
];
