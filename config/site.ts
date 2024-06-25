export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "AES",
  description: "Automated Essay Scoring System",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/",
    },

    {
      label: "Team",
      href: "/team",
    },

    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {},
};
