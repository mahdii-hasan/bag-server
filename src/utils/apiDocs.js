export const apiDocs = {
  title: "Bag api doc",
  version: "1.0.0",
  baseUrl: "domain/api",

  routes: [
    {
      module: "Auth",
      endpoints: [
        {
          method: "POST",
          path: "/register",
          body: ["name", "email", "password"],
        },
        {
          method: "POST",
          path: "/login",
          body: ["email", "password"],
        },
        {
          method: "POST",
          path: "/change-password",
          body: ["oldPassword", "newPassword"],
        },
        {
          method: "POST",
          path: "/refresh-token",
        },
        {
          method: "POST",
          path: "/logout",
        },
      ],
    },

  ],
};