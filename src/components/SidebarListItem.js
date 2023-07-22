import { Avatar } from "@mui/material"
import Link from "next/link"

export default function SidebarListItem({ item }) {
  return (
    <Link className="link" href={`/?roomId=${item.id}`}>
      <div className="sidebar__chat">
        <div className="avatar__container">
          <Avatar
            src={
              item.photoURL ||
              //   `https://api.dicebear.com/6.x/thumbs/svg?seed=${item.id}`
              `https://source.boringavatars.com/marble/45/${item.id}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`
            }
            style={{ width: 45, height: 45 }}
          />
        </div>
        <div className="sidebar__chat--info">
          <h2>{item.name}</h2>
        </div>
      </div>
    </Link>
  )
}
