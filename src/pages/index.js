import Login from "@/components/Login"
import Sidebar from "@/components/Sidebar"
import useAuthUser from "@/hooks/useAuthUser"
export default function Home() {
  const user = useAuthUser()

  if (!user) return <Login />
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar user={user} />
      </div>
    </div>
  )
}
