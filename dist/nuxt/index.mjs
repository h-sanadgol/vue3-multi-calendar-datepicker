import { defineNuxtModule, createResolver, addImportsDir, addComponentsDir } from '@nuxt/kit';

const index = defineNuxtModule({
  meta: {
    name: "@alireza-ab/vue3-persian-datepicker",
    configKey: "datepicker",
    compatibility: {
      nuxt: "^3.0.0 || ^4.0.0"
    }
  },
  defaults: {
    PersianDate: false
  },
  setup(options, nuxt) {
    const { include } = nuxt.options.vite.optimizeDeps;
    nuxt.options.vite.optimizeDeps.include = [
      ...include || [],
      "@alireza-ab/persian-date"
    ];
    const { resolve } = createResolver(import.meta.url);
    if (options.PersianDate)
      addImportsDir(resolve("../../src/nuxt/composable"));
    addComponentsDir({
      path: resolve("../../src/components"),
      pattern: "**/*.vue"
    });
  }
});

export { index as default };
