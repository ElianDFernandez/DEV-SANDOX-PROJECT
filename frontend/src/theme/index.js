import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  globalCss: {
    "*": {
      transitionProperty: "background-color, color, border-color, fill, stroke",
      transitionDuration: "800ms",
      transitionTimingFunction: "ease",
    },
    "input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0px 1000px var(--chakra-colors-superficie-fondo) inset !important",
      WebkitTextFillColor: "var(--chakra-colors-texto-principal) !important",
      caretColor: "var(--chakra-colors-texto-principal)",
    },
    "input:-webkit-autofill:hover, input:-webkit-autofill:focus": {
      WebkitBoxShadow: "0 0 0px 1000px var(--chakra-colors-superficie-fondo) inset !important",
      WebkitTextFillColor: "var(--chakra-colors-texto-principal) !important",
    }
  },
  theme: {
    tokens: {
      colors: {
        marca: {
          50:  { value: "#EBF3FF" },
          100: { value: "#D1E4FF" },
          200: { value: "#A3C9FF" },
          300: { value: "#75ADFF" },
          400: { value: "#4792FF" },
          500: { value: "#3686FF" },
          600: { value: "#2866CC" },
          700: { value: "#1B4799" },
          800: { value: "#0E2866" },
          900: { value: "#050D33" },
        },
      },
    },
    semanticTokens: {
      colors: {
        superficie: {
          fondo: { 
            value: { base: "#E8ECEB", _dark: "#1A202C" } 
          },
          fondoSecundario: { 
            value: { base: "#3686FF", _dark: "#3686FF" }
          },
          sidebar: { 
            value: { base: "#FFFFFF", _dark: "#2D3748" } 
          },
          borde: { 
            value: { base: "#E2E8F0", _dark: "#4A5568" } 
          },
          tarjeta: { 
            value: { base: "#FFFFFF", _dark: "#2D3748" } 
          },
        },
        texto: {
          principal: { 
            value: { base: "#141414", _dark: "#F7FAFC" } 
          },
          secundario: { 
            value: { base: "#2c2c2c", _dark: "#A0AEC0" } 
          },
          inverso: { 
            value: { base: "#FFFFFF", _dark: "#1A202C" } 
          },
          success: {
            value: { base: "#38A169", _dark: "#48BB78" }
          },
          error: { 
            value: { base: "#E53E3E", _dark: "#FC8181" }
          }
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)