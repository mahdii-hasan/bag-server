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
          path: "/auth/register",
          body: ["name", "email", "password"],
        },
        {
          method: "POST",
          path: "/auth/login",
          body: ["email", "password"],
        },
        {
          method: "POST",
          path: "/auth/change-password",
          body: ["oldPassword", "newPassword"],
        },
        {
          method: "POST",
          path: "/auth/forgot-password",
          body: ["email"],
        },
        {
          method: "PUT",
          path: "/auth/reset-password/:token",
          body: ["newPassword"],
        },
        {
          method: "POST",
          path: "/auth/refresh-token",
        },
        {
          method: "POST",
          path: "/auth/logout",
        },
      ],
    },
    {
      module: "user",
      endpoints: [
        {
          method: "GET",
          path: "/user/me",
        },
        {
          method: "PUT",
          path: "/user/me",
          body: ["name"],
        },
        {
          method: "PUT",
          path: "/user/avatar",
          body: ["image"],
        },
        {
          method: "DELETE",
          path: "/user/avatar",
        },
        {
          method: "DELETE",
          path: "/user/me",
        },
      ],
    },

  ],
};