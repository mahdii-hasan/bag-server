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
      module: "User",
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
    {
      module: "Category",
      endpoints: [
        {
          method: "GET",
          path: "/categories/",
        },
        {
          method: "GET",
          path: "/categories/:id",
        },
        {
          method: "POST",
          path: "/categories/",
          body: ["name", "slug", "disc", "image", "sortOrder", "m.title", "m.desc", "createdBy"],
        },
        {
          method: "PUT",
          path: "/categories/:id",
          body: ["name", "slug", "disc", "image", "sortOrder", "m.title", "m.desc", "createdBy"],
        },
        {
          method: "DELETE",
          path: "/categories/:id",
        },
        
      ],
    },
    {
      module: "Product",
      endpoints: [
        {
          method: "GET",
          path: "/products/",
        },
        {
          method: "GET",
          path: "/products/:id",
        },
        {
          method: "POST",
          path: "/products/",
          body: ["title", "slug", "disc","brand" ,"category", "price", "discountPrice","Stock", "sku", "createdBy", "updatedBy" , "images", "m.title", "m.desc", "createdBy"],
        },
        {
          method: "PUT",
          path: "/products/:id",
          body: ["title", "slug", "disc","brand" ,"category", "price", "discountPrice","Stock", "sku", "createdBy", "updatedBy" , "images", "m.title", "m.desc", "createdBy"],
        },
        {
          method: "DELETE",
          path: "/product/:id",
        },
        
      ],
    },

  ],
};