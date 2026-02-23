export const splashItems = [
  {
    id: "heart",
    title: "Heart Signature",
    note: "Cuore particellare",
  },
  {
    id: "moon",
    title: "Glowing Moon",
    note: "Luna con polvere luminosa",
  },
  {
    id: "rocket",
    title: "Rocket Trail",
    note: "Razzo con firma finale",
  },
  {
    id: "orbit",
    title: "Orbit Signal",
    note: "Anelli e convergenza",
  },
  {
    id: "matrix",
    title: "Matrix Binary Rain",
    note: "Cascata binaria verde",
  },
];

export function getSplashById(id) {
  return splashItems.find((item) => item.id === id) || splashItems[0];
}
