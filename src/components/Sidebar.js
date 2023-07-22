import {
  Add,
  ExitToApp,
  Home,
  Message,
  PeopleAlt,
  SearchOutlined,
} from "@mui/icons-material"
import { Avatar, IconButton } from "@mui/material"
import SidebarTab from "./SidebarTab"
import Button from "@mui/material/Button"
import { useState } from "react"
import SidebarList from "./SidebarList"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore"
import { auth, db } from "@/utils/firebase"
import { useRouter } from "next/router"
import useRooms from "@/hooks/useRooms"
import useUsers from "@/hooks/useUsers"
import useChats from "@/hooks/useChats"
const tabs = [
  {
    id: 1,
    icon: <Home />,
  },
  {
    id: 2,
    icon: <Message />,
  },
  {
    id: 3,
    icon: <PeopleAlt />,
  },
]

export default function Sidebar({ user }) {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [menu, setMenu] = useState(1)
  const [roomName, setRoomName] = useState("")
  const router = useRouter()
  const rooms = useRooms()
  const users = useUsers(user)
  const chats = useChats(user)
  const [searchResults, setSearchResults] = useState([])

  async function createRoom() {
    if (roomName?.trim()) {
      const roomsRef = collection(db, "rooms")
      const newRoom = await addDoc(roomsRef, {
        name: roomName,
        timestamp: serverTimestamp(),
      })
      setIsCreatingRoom(false)
      setRoomName("")
      setMenu(2)
      router.push(`/?roomId=${newRoom.id}`)
    }
  }

  async function searchUsersAndRooms(event) {
    event.preventDefault()
    const searchValue = event.target.elements.search.value
    const end = searchValue.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1)
    )

    const userQuery = query(
      collection(db, "users"),
      where("name", ">=", searchValue),
      where("name", "<", end)
    )
    const roomQuery = query(
      collection(db, "rooms"),
      where("name", ">=", searchValue),
      where("name", "<", end)
    )

    const userSnapshot = await getDocs(userQuery)
    const roomSnapshot = await getDocs(roomQuery)
    const userResults = userSnapshot?.docs.map((doc) => {
      const id =
        doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`
      if (doc.id !== user.uid) {
        return { id, ...doc.data() }
      }
    })
    const roomResults = roomSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    const searchResults = [...userResults, ...roomResults].filter(
      (elements) => elements !== undefined
    )

    setMenu(4)
    setSearchResults(searchResults)
    console.log(searchResults)
  }

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar__header">
        <div className="sidebar__header--left">
          <Avatar src={user?.photoURL} alt={user?.displayName} />
          <h4>{user?.displayName}</h4>
        </div>
        <div className="sidebar__header--right">
          <IconButton
            onClick={() => {
              auth.signOut()
            }}
          >
            <ExitToApp />
          </IconButton>
        </div>
      </div>

      {/* Search Form */}
      <div className="sidebar__search">
        <form
          onSubmit={searchUsersAndRooms}
          className="sidebar__search--container"
        >
          <SearchOutlined />
          <input
            type="text"
            id="search"
            placeholder="Search for users or rooms"
          ></input>
        </form>
      </div>

      {/* Menu Selection */}
      <div className="sidebar__menu">
        {tabs.map((tab) => (
          <SidebarTab
            key={tab.id}
            onClick={() => setMenu(tab.id)}
            isActive={tab.id === menu}
          >
            <div className="sidebar__menu--home">
              {tab.icon}
              <div className="sidebar__menu--line" />
            </div>
          </SidebarTab>
        ))}
      </div>

      {/* Sidebar List */}
      {menu === 1 ? (
        <SidebarList title="Chats" data={chats} />
      ) : menu === 2 ? (
        <SidebarList title="Rooms" data={rooms} />
      ) : menu === 3 ? (
        <SidebarList title="Users" data={users} />
      ) : menu === 4 ? (
        <SidebarList
          title={`Search Results - ${searchResults.length}`}
          data={searchResults}
        />
      ) : null}

      {/* Create Room Button */}
      <div className="sidebar__chat--addRoom">
        <IconButton onClick={() => setIsCreatingRoom(true)}>
          <Add />
        </IconButton>
      </div>
      {/* Create Room Dialog */}
      <Dialog
        maxWidth="sm"
        open={isCreatingRoom}
        onClose={() => setIsCreatingRoom(false)}
      >
        <DialogTitle>Create new room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type the name of your public room. Every user will be able to join
            this room.
          </DialogContentText>
          <TextField
            autoFocus
            onChange={(event) => {
              setRoomName(event.target.value)
            }}
            value={roomName}
            margin="dense"
            id="roomName"
            label="Room Name"
            type="text"
            fullWidth
            variant="standard"
            style={{ marginTop: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setIsCreatingRoom(false)}>
            Cancel
          </Button>
          <Button onClick={createRoom}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
