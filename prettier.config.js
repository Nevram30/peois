/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  printWidth: 80,       
  tabWidth: 5,          
  trailingComma: "all", 
  plugins: ["prettier-plugin-tailwindcss"],
};

module.exports = config;