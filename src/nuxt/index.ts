import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addComponentsDir,
} from '@nuxt/kit';

export interface DatePickerNuxtOptions {
  PersianDate?: boolean;
}

type NuxtLike = {
  options: {
    vite: {
      optimizeDeps?: {
        include?: string[];
      };
    };
  };
};

export default defineNuxtModule<DatePickerNuxtOptions>({
  meta: {
    name: '@h-sanadgol/vue3-multi-calendar-datepicker',
    configKey: 'datepicker',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    PersianDate: false,
  },
  setup(options: DatePickerNuxtOptions, nuxt: NuxtLike) {
    const { include } = nuxt.options.vite.optimizeDeps!;
    nuxt.options.vite.optimizeDeps!.include = [
      ...(include || []),
      '@alireza-ab/persian-date',
    ];

    const { resolve } = createResolver(import.meta.url);

    if (options.PersianDate)
      addImportsDir(resolve('../../src/nuxt/composable'));

    addComponentsDir({
      path: resolve('../../src/components'),
      pattern: '**/*.vue',
    });
  },
});

declare module '@nuxt/schema' {
  interface NuxtConfig {
    datepicker?: DatePickerNuxtOptions;
  }
  interface NuxtOptions {
    datepicker?: DatePickerNuxtOptions;
  }
}
