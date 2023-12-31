// .eslintrc.mjs
export default {
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn', // or 'off' to allow unused variables
  },
};
