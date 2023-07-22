import styles from "@/styles/globals.css"

import { Inter } from "next/font/google"
// import dotenv from "dotenv"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
// dotenv.config()
const inter = Inter({ subsets: ["latin"] })

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: [inter.style.fontFamily, "sans-serif"].join(","),
    },
  },
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <main className={inter.className}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>{" "}
      </main>
    </>
  )
}
