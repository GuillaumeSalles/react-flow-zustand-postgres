import useStore from "@/store";
import { Avatar } from "./Avatar";
import styles from "./Avatars.module.css";

export default function Avatars() {
  const users = useStore((state) => state.others);
  const currentUser = useStore((state) => state.currentUser);
  const hasMoreUsers = users.length > 3;

  return (
    <div className="flex pl-3">
      {users.slice(0, 3).map(({ connectionId, info }) => {
        return (
          <Avatar key={connectionId} picture={info.picture} name={info.name} />
        );
      })}

      {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}

      {currentUser && (
        <div className="relative ml-8 first:ml-0">
          <Avatar picture={currentUser.info.picture} name="You" />
        </div>
      )}
    </div>
  );
}
