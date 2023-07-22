import { Html, Head, Main, NextScript } from "next/document"
import { Inter } from "next/font/google"
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/x-icon" href="images/favicon.ico" />
        <title>ChatX</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
