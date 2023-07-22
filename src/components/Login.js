import { Button } from "@mui/material"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { auth } from "@/utils/firebase"
export default function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)
  console.log(signInWithGoogle)
  if (error) {
    console.log(error)
  }
  return (
    <div className="app">
      <div className="login">
        <div className="login__background" />
        <div className="login__container">
          <img src="images/logo.png" alt="Logo" />
          <div className="login__text">
            <h1>Sign in to ChatX</h1>
          </div>
          <Button onClick={() => signInWithGoogle()}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
