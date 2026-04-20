import { Icons } from "consts/icons";
import { appRouter } from "consts/router";

export const navigation = [
  {
    id: 1,
    label: "AVSOC",
    subNavigation: [
      {
        id: 1,
        name: "administrar",
        label: "Administrar",
        href: `${appRouter.dashboard.subLinks.administrar.href}`,
        icon: Icons.administrar,
        dropdownVisible: false,
        dropdown: [
          {
            name: "federaciones",
            label: "Federaciones",
            href: `${appRouter.dashboard.subLinks.administrar.href}/${appRouter.dashboard.subLinks.administrar.subLinks.federaciones.href}`,
            icon: Icons.card,
          },
          {
            name: "distritos",
            label: "Distritos",
            href: `${appRouter.dashboard.subLinks.administrar.href}/${appRouter.dashboard.subLinks.administrar.subLinks.distritos.href}`,
            icon: Icons.card,
          },
          {
            name: "iglesias",
            label: "Iglesias",
            href: `${appRouter.dashboard.subLinks.administrar.href}/${appRouter.dashboard.subLinks.administrar.subLinks.iglesias.href}`,
            icon: Icons.card,
          },
          {
            name: "clubes",
            label: "Clubes",
            href: `${appRouter.dashboard.subLinks.administrar.href}/${appRouter.dashboard.subLinks.administrar.subLinks.clubes.href}`,
            icon: Icons.card,
          },
          {
            name: "miembros",
            label: "Miembros",
            href: `${appRouter.dashboard.subLinks.administrar.href}/${appRouter.dashboard.subLinks.administrar.subLinks.miembros.href}`,
            icon: Icons.card,
          },
        ],
      },
      {
        id: 2,
        name: "listado",
        label: "Camporee",
        href: `${appRouter.dashboard.href}${appRouter.dashboard.subLinks.camporee.href}`,
        icon: Icons.camporee,
      },
			{
        id: 3,
        name: "listado",
        label: "Festival SJ",
        href: `${appRouter.dashboard.href}${appRouter.dashboard.subLinks.festival.href}`,
        icon: Icons.camporee,
      },
      {
        id: 4,
        name: "informes_mensuales",
        label: "Informes Mensuales",
        href: `${appRouter.dashboard.subLinks.informesMensuales.href}`,
        icon: Icons.informes_mensuales,
      },
    ],
  },
];
