import {defineConfig} from 'vite-plugin-windicss';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#0AF0FD',
        danger: '#FF5C43',
        deepBlue: '#0B2363',
        normal: '#27F255',
        warning: '#F19826',
      },
    },
  },
  shortcuts: {
    'flex-center': {
      '@apply': 'flex items-center justify-center',
    },
    'flex-between': {
      '@apply': 'flex items-center justify-between',
    },
    'flexwrap': {
      '@apply': 'flex flex-wrap',
    },
  },

});
