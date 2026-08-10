'use strict';

const kit = require('@nuxt/kit');

var _documentCurrentScript =
  typeof document !== 'undefined' ? document.currentScript : null;
const index = kit.defineNuxtModule({
  meta: {
    name: '@alireza-ab/vue3-persian-datepicker',
    configKey: 'datepicker',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    PersianDate: false,
  },
  setup(options, nuxt) {
    const { include } = nuxt.options.vite.optimizeDeps;
    nuxt.options.vite.optimizeDeps.include = [
      ...(include || []),
      '@alireza-ab/persian-date',
    ];
    const { resolve } = kit.createResolver(
      typeof document === 'undefined'
        ? require('u' + 'rl').pathToFileURL(__filename).href
        : (_documentCurrentScript &&
            _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' &&
            _documentCurrentScript.src) ||
            new URL('nuxt/index.cjs', document.baseURI).href,
    );
    if (options.PersianDate)
      kit.addImportsDir(resolve('../../src/nuxt/composable'));
    kit.addComponentsDir({
      path: resolve('../../src/components'),
      pattern: '**/*.vue',
    });
  },
});

module.exports = index;
