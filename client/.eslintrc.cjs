module.exports = {
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
  plugins: ['vue'],
  rules: {
    'prettier/prettier': 'off',
    'no-unused-vars': 'warn', // or 'off' to allow unused variables
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/no-contradicting-classname': 'off',
  },
}
