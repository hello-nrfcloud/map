// vite.config.ts
import { fromEnv } from "file:///home/m/hello-nrfcloud/map/node_modules/@nordicsemiconductor/from-env/dist/index.js";
import { defineConfig } from "file:///home/m/hello-nrfcloud/map/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///home/m/hello-nrfcloud/map/node_modules/vite-plugin-solid/dist/esm/index.mjs";

// src/util/trimTrailingSlash.ts
var trimTrailingSlash = (s) => s.replace(/\/+$/, "");

// package.json
var package_default = {
  name: "@hello.nrfcloud.com/map",
  version: "0.0.0-development",
  type: "module",
  repository: {
    type: "git",
    url: "git+https://github.com/hello-nrfcloud/map.git"
  },
  bugs: {
    url: "https://github.com/hello-nrfcloud/map/issues"
  },
  homepage: "https://hello.nrfcloud.com/map",
  keywords: [
    "nordicsemiconductor",
    "cellular-iot",
    "hello-nrfcloud"
  ],
  author: "Nordic Semiconductor ASA | nordicsemi.no",
  license: "BSD-3-Clause",
  description: "Show public devices on a map",
  scripts: {
    start: "vite",
    build: "node --max_old_space_size=8192 ./node_modules/vite/bin/vite.js build --emptyOutDir",
    prepare: "husky",
    test: "find ./ -type f -name *.spec.ts -not -path './node_modules/*' | xargs npx tsx --test --test-reporter spec"
  },
  devDependencies: {
    "@aws-sdk/client-cloudformation": "3.515.0",
    "@aws-sdk/client-cloudfront": "3.515.0",
    "@bifravst/eslint-config-typescript": "6.0.5",
    "@bifravst/prettier-config": "1.0.0",
    "@commitlint/config-conventional": "18.6.2",
    "@nordicsemiconductor/cloudformation-helpers": "9.0.3",
    "@nordicsemiconductor/from-env": "3.0.1",
    "@types/node": "20.11.20",
    "eslint-plugin-jsx-a11y": "6.8.0",
    glob: "10.3.10",
    husky: "9.0.11",
    "the-new-css-reset": "1.11.2",
    tsx: "4.7.1",
    vite: "5.1.4",
    "vite-plugin-solid": "2.10.1"
  },
  dependencies: {
    "@hello.nrfcloud.com/proto": "6.4.15",
    "date-fns": "3.3.1",
    "e118-iin-list": "4.1.2",
    lucide: "0.338.0"
  },
  engines: {
    node: ">=20.0.0",
    npm: ">=9.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint"
    ],
    "*.{md,json,yaml,yml,html,css}": [
      "prettier --write"
    ]
  },
  prettier: "@bifravst/prettier-config",
  release: {
    branches: [
      "saga"
    ],
    remoteTags: true,
    plugins: [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      [
        "@semantic-release/github",
        {
          successComment: false,
          failTitle: false
        }
      ]
    ]
  }
};

// vite.config.ts
var {
  version: defaultVersion,
  homepage,
  repository: { url: repositoryUrl }
} = package_default;
var version = process.env.VERSION ?? defaultVersion;
var { registryEndpoint } = fromEnv({
  registryEndpoint: "REGISTRY_ENDPOINT"
})(process.env);
var base = trimTrailingSlash(process.env.BASE_URL ?? "");
var vite_config_default = defineConfig({
  plugins: [solidPlugin()],
  base,
  preview: {
    host: "localhost",
    port: 8080
  },
  server: {
    host: "localhost",
    port: 8080
  },
  // string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
  define: {
    HOMEPAGE: JSON.stringify(homepage),
    VERSION: JSON.stringify(version ?? Date.now()),
    BUILD_TIME: JSON.stringify((/* @__PURE__ */ new Date()).toISOString()),
    REGISTRY_ENDPOINT: JSON.stringify(new URL(registryEndpoint).toString()),
    BASE_URL: JSON.stringify(base),
    REPOSITORY_URL: JSON.stringify(repositoryUrl.replace("git+", ""))
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3V0aWwvdHJpbVRyYWlsaW5nU2xhc2gudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvbS9oZWxsby1ucmZjbG91ZC9tYXBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL20vaGVsbG8tbnJmY2xvdWQvbWFwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL20vaGVsbG8tbnJmY2xvdWQvbWFwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZnJvbUVudiB9IGZyb20gJ0Bub3JkaWNzZW1pY29uZHVjdG9yL2Zyb20tZW52J1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBzb2xpZFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1zb2xpZCdcbmltcG9ydCB7IHRyaW1UcmFpbGluZ1NsYXNoIH0gZnJvbSAnLi9zcmMvdXRpbC90cmltVHJhaWxpbmdTbGFzaC5qcydcbmltcG9ydCBwSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbidcblxuY29uc3Qge1xuXHR2ZXJzaW9uOiBkZWZhdWx0VmVyc2lvbixcblx0aG9tZXBhZ2UsXG5cdHJlcG9zaXRvcnk6IHsgdXJsOiByZXBvc2l0b3J5VXJsIH0sXG59ID0gcEpzb25cbmNvbnN0IHZlcnNpb24gPSBwcm9jZXNzLmVudi5WRVJTSU9OID8/IGRlZmF1bHRWZXJzaW9uXG5jb25zdCB7IHJlZ2lzdHJ5RW5kcG9pbnQgfSA9IGZyb21FbnYoe1xuXHRyZWdpc3RyeUVuZHBvaW50OiAnUkVHSVNUUllfRU5EUE9JTlQnLFxufSkocHJvY2Vzcy5lbnYpXG5cbmNvbnN0IGJhc2UgPSB0cmltVHJhaWxpbmdTbGFzaChwcm9jZXNzLmVudi5CQVNFX1VSTCA/PyAnJylcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtzb2xpZFBsdWdpbigpXSxcblx0YmFzZSxcblx0cHJldmlldzoge1xuXHRcdGhvc3Q6ICdsb2NhbGhvc3QnLFxuXHRcdHBvcnQ6IDgwODAsXG5cdH0sXG5cdHNlcnZlcjoge1xuXHRcdGhvc3Q6ICdsb2NhbGhvc3QnLFxuXHRcdHBvcnQ6IDgwODAsXG5cdH0sXG5cdC8vIHN0cmluZyB2YWx1ZXMgd2lsbCBiZSB1c2VkIGFzIHJhdyBleHByZXNzaW9ucywgc28gaWYgZGVmaW5pbmcgYSBzdHJpbmcgY29uc3RhbnQsIGl0IG5lZWRzIHRvIGJlIGV4cGxpY2l0bHkgcXVvdGVkXG5cdGRlZmluZToge1xuXHRcdEhPTUVQQUdFOiBKU09OLnN0cmluZ2lmeShob21lcGFnZSksXG5cdFx0VkVSU0lPTjogSlNPTi5zdHJpbmdpZnkodmVyc2lvbiA/PyBEYXRlLm5vdygpKSxcblx0XHRCVUlMRF9USU1FOiBKU09OLnN0cmluZ2lmeShuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpLFxuXHRcdFJFR0lTVFJZX0VORFBPSU5UOiBKU09OLnN0cmluZ2lmeShuZXcgVVJMKHJlZ2lzdHJ5RW5kcG9pbnQpLnRvU3RyaW5nKCkpLFxuXHRcdEJBU0VfVVJMOiBKU09OLnN0cmluZ2lmeShiYXNlKSxcblx0XHRSRVBPU0lUT1JZX1VSTDogSlNPTi5zdHJpbmdpZnkocmVwb3NpdG9yeVVybC5yZXBsYWNlKCdnaXQrJywgJycpKSxcblx0fSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL20vaGVsbG8tbnJmY2xvdWQvbWFwL3NyYy91dGlsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tL2hlbGxvLW5yZmNsb3VkL21hcC9zcmMvdXRpbC90cmltVHJhaWxpbmdTbGFzaC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9tL2hlbGxvLW5yZmNsb3VkL21hcC9zcmMvdXRpbC90cmltVHJhaWxpbmdTbGFzaC50c1wiO2V4cG9ydCBjb25zdCB0cmltVHJhaWxpbmdTbGFzaCA9IChzOiBzdHJpbmcpOiBzdHJpbmcgPT4gcy5yZXBsYWNlKC9cXC8rJC8sICcnKVxuIiwgIntcbiAgXCJuYW1lXCI6IFwiQGhlbGxvLm5yZmNsb3VkLmNvbS9tYXBcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjAtZGV2ZWxvcG1lbnRcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2hlbGxvLW5yZmNsb3VkL21hcC5naXRcIlxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2hlbGxvLW5yZmNsb3VkL21hcC9pc3N1ZXNcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9oZWxsby5ucmZjbG91ZC5jb20vbWFwXCIsXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwibm9yZGljc2VtaWNvbmR1Y3RvclwiLFxuICAgIFwiY2VsbHVsYXItaW90XCIsXG4gICAgXCJoZWxsby1ucmZjbG91ZFwiXG4gIF0sXG4gIFwiYXV0aG9yXCI6IFwiTm9yZGljIFNlbWljb25kdWN0b3IgQVNBIHwgbm9yZGljc2VtaS5ub1wiLFxuICBcImxpY2Vuc2VcIjogXCJCU0QtMy1DbGF1c2VcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlNob3cgcHVibGljIGRldmljZXMgb24gYSBtYXBcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInN0YXJ0XCI6IFwidml0ZVwiLFxuICAgIFwiYnVpbGRcIjogXCJub2RlIC0tbWF4X29sZF9zcGFjZV9zaXplPTgxOTIgLi9ub2RlX21vZHVsZXMvdml0ZS9iaW4vdml0ZS5qcyBidWlsZCAtLWVtcHR5T3V0RGlyXCIsXG4gICAgXCJwcmVwYXJlXCI6IFwiaHVza3lcIixcbiAgICBcInRlc3RcIjogXCJmaW5kIC4vIC10eXBlIGYgLW5hbWUgKi5zcGVjLnRzIC1ub3QgLXBhdGggJy4vbm9kZV9tb2R1bGVzLyonIHwgeGFyZ3MgbnB4IHRzeCAtLXRlc3QgLS10ZXN0LXJlcG9ydGVyIHNwZWNcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYXdzLXNkay9jbGllbnQtY2xvdWRmb3JtYXRpb25cIjogXCIzLjUxNS4wXCIsXG4gICAgXCJAYXdzLXNkay9jbGllbnQtY2xvdWRmcm9udFwiOiBcIjMuNTE1LjBcIixcbiAgICBcIkBiaWZyYXZzdC9lc2xpbnQtY29uZmlnLXR5cGVzY3JpcHRcIjogXCI2LjAuNVwiLFxuICAgIFwiQGJpZnJhdnN0L3ByZXR0aWVyLWNvbmZpZ1wiOiBcIjEuMC4wXCIsXG4gICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiMTguNi4yXCIsXG4gICAgXCJAbm9yZGljc2VtaWNvbmR1Y3Rvci9jbG91ZGZvcm1hdGlvbi1oZWxwZXJzXCI6IFwiOS4wLjNcIixcbiAgICBcIkBub3JkaWNzZW1pY29uZHVjdG9yL2Zyb20tZW52XCI6IFwiMy4wLjFcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiMjAuMTEuMjBcIixcbiAgICBcImVzbGludC1wbHVnaW4tanN4LWExMXlcIjogXCI2LjguMFwiLFxuICAgIFwiZ2xvYlwiOiBcIjEwLjMuMTBcIixcbiAgICBcImh1c2t5XCI6IFwiOS4wLjExXCIsXG4gICAgXCJ0aGUtbmV3LWNzcy1yZXNldFwiOiBcIjEuMTEuMlwiLFxuICAgIFwidHN4XCI6IFwiNC43LjFcIixcbiAgICBcInZpdGVcIjogXCI1LjEuNFwiLFxuICAgIFwidml0ZS1wbHVnaW4tc29saWRcIjogXCIyLjEwLjFcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaGVsbG8ubnJmY2xvdWQuY29tL3Byb3RvXCI6IFwiNi40LjE1XCIsXG4gICAgXCJkYXRlLWZuc1wiOiBcIjMuMy4xXCIsXG4gICAgXCJlMTE4LWlpbi1saXN0XCI6IFwiNC4xLjJcIixcbiAgICBcImx1Y2lkZVwiOiBcIjAuMzM4LjBcIlxuICB9LFxuICBcImVuZ2luZXNcIjoge1xuICAgIFwibm9kZVwiOiBcIj49MjAuMC4wXCIsXG4gICAgXCJucG1cIjogXCI+PTkuMC4wXCJcbiAgfSxcbiAgXCJsaW50LXN0YWdlZFwiOiB7XG4gICAgXCIqLnt0cyx0c3h9XCI6IFtcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiLFxuICAgICAgXCJlc2xpbnRcIlxuICAgIF0sXG4gICAgXCIqLnttZCxqc29uLHlhbWwseW1sLGh0bWwsY3NzfVwiOiBbXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxuICAgIF1cbiAgfSxcbiAgXCJwcmV0dGllclwiOiBcIkBiaWZyYXZzdC9wcmV0dGllci1jb25maWdcIixcbiAgXCJyZWxlYXNlXCI6IHtcbiAgICBcImJyYW5jaGVzXCI6IFtcbiAgICAgIFwic2FnYVwiXG4gICAgXSxcbiAgICBcInJlbW90ZVRhZ3NcIjogdHJ1ZSxcbiAgICBcInBsdWdpbnNcIjogW1xuICAgICAgXCJAc2VtYW50aWMtcmVsZWFzZS9jb21taXQtYW5hbHl6ZXJcIixcbiAgICAgIFwiQHNlbWFudGljLXJlbGVhc2UvcmVsZWFzZS1ub3Rlcy1nZW5lcmF0b3JcIixcbiAgICAgIFtcbiAgICAgICAgXCJAc2VtYW50aWMtcmVsZWFzZS9naXRodWJcIixcbiAgICAgICAge1xuICAgICAgICAgIFwic3VjY2Vzc0NvbW1lbnRcIjogZmFsc2UsXG4gICAgICAgICAgXCJmYWlsVGl0bGVcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgXVxuICAgIF1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUSxTQUFTLGVBQWU7QUFDeFIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7OztBQ0ZzUixJQUFNLG9CQUFvQixDQUFDLE1BQXNCLEVBQUUsUUFBUSxRQUFRLEVBQUU7OztBQ0FuWDtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE1BQVE7QUFBQSxJQUNOLEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxVQUFZO0FBQUEsRUFDWixVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBVTtBQUFBLEVBQ1YsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsU0FBVztBQUFBLElBQ1gsTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLGtDQUFrQztBQUFBLElBQ2xDLDhCQUE4QjtBQUFBLElBQzlCLHNDQUFzQztBQUFBLElBQ3RDLDZCQUE2QjtBQUFBLElBQzdCLG1DQUFtQztBQUFBLElBQ25DLCtDQUErQztBQUFBLElBQy9DLGlDQUFpQztBQUFBLElBQ2pDLGVBQWU7QUFBQSxJQUNmLDBCQUEwQjtBQUFBLElBQzFCLE1BQVE7QUFBQSxJQUNSLE9BQVM7QUFBQSxJQUNULHFCQUFxQjtBQUFBLElBQ3JCLEtBQU87QUFBQSxJQUNQLE1BQVE7QUFBQSxJQUNSLHFCQUFxQjtBQUFBLEVBQ3ZCO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QsNkJBQTZCO0FBQUEsSUFDN0IsWUFBWTtBQUFBLElBQ1osaUJBQWlCO0FBQUEsSUFDakIsUUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxJQUNSLEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxlQUFlO0FBQUEsSUFDYixjQUFjO0FBQUEsTUFDWjtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxpQ0FBaUM7QUFBQSxNQUMvQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxVQUFZO0FBQUEsRUFDWixTQUFXO0FBQUEsSUFDVCxVQUFZO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFlBQWM7QUFBQSxJQUNkLFNBQVc7QUFBQSxNQUNUO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsZ0JBQWtCO0FBQUEsVUFDbEIsV0FBYTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FGMUVBLElBQU07QUFBQSxFQUNMLFNBQVM7QUFBQSxFQUNUO0FBQUEsRUFDQSxZQUFZLEVBQUUsS0FBSyxjQUFjO0FBQ2xDLElBQUk7QUFDSixJQUFNLFVBQVUsUUFBUSxJQUFJLFdBQVc7QUFDdkMsSUFBTSxFQUFFLGlCQUFpQixJQUFJLFFBQVE7QUFBQSxFQUNwQyxrQkFBa0I7QUFDbkIsQ0FBQyxFQUFFLFFBQVEsR0FBRztBQUVkLElBQU0sT0FBTyxrQkFBa0IsUUFBUSxJQUFJLFlBQVksRUFBRTtBQUd6RCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsWUFBWSxDQUFDO0FBQUEsRUFDdkI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUDtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDUCxVQUFVLEtBQUssVUFBVSxRQUFRO0FBQUEsSUFDakMsU0FBUyxLQUFLLFVBQVUsV0FBVyxLQUFLLElBQUksQ0FBQztBQUFBLElBQzdDLFlBQVksS0FBSyxXQUFVLG9CQUFJLEtBQUssR0FBRSxZQUFZLENBQUM7QUFBQSxJQUNuRCxtQkFBbUIsS0FBSyxVQUFVLElBQUksSUFBSSxnQkFBZ0IsRUFBRSxTQUFTLENBQUM7QUFBQSxJQUN0RSxVQUFVLEtBQUssVUFBVSxJQUFJO0FBQUEsSUFDN0IsZ0JBQWdCLEtBQUssVUFBVSxjQUFjLFFBQVEsUUFBUSxFQUFFLENBQUM7QUFBQSxFQUNqRTtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
