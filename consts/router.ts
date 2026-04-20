export const appRouter = {
  dashboard: {
    href: "/dashboard",
    cards: { href: "" },
    subLinks: {
      administrar: {
        href: "/administrar",
        subLinks: {
          federaciones: { href: "federaciones" },
          distritos: { href: "distritos" },
          iglesias: { href: "iglesias" },
          clubes: { href: "clubes" },
          miembros: { href: "miembros" },
        },
      },
      estadisticas: {
        href: "/estadisticas",
      },
			festival: {
        href: "/festival",
      },
      camporee: {
        href: "/camporee",
        subLinks: {
          detail: { href: "detail" },
          events: {
            href: "eventos",
            subLinks: {
              precamporee: {
                href: "precamporee",
                subLinks: {
                  detail: { href: "detail" },
                },
              },
              camporee: {
                href: "camporee",
                subLinks: {
                  detail: { href: "detail" },
                },
              },
            },
          },
        },
      },
      especialidades: {
        href: "/especialidades",
      },
      informesMensuales: {
        href: "/dashboard/informes-mensuales",
      },
    },
  },
};
