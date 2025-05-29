import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes: async (defineRoutes) => {
        return defineRoutes((route) => {
          // Auth route
          route("/auth", "routes/auth/page.tsx");

          // User login route
          route("/user/login", "routes/user/login/page.tsx");
          route("/user/signup", "routes/user/signup/page.tsx");
          route("/user/dashboard", "routes/user/dashboard/page.tsx")
          // Admin login route
          route("/admin/login", "routes/admin/login/page.tsx");
          route("/admin/signup", "routes/admin/signup/page.tsx");
          route("/admin/dashboard", "routes/admin/dashboard/page.tsx")

        });
      },
    }),
    tsconfigPaths(),
  ],
});
