import IUser from "@/interfaces/user";
import UserAvatar from "../UserAvatar";
import { Button } from "@/components/ui/button";
import useAddFriend from "@/hooks/useAddFriend";
import { useTranslation } from "react-i18next";
import { IFriend } from "@/interfaces/friend";
import { User } from "lucide-react";

interface Props {
  friend?: IFriend;
  users: IUser[];
  isLoading: boolean;
}

function SearchFriends({ friend, users, isLoading }: Props) {
  const { t } = useTranslation();
  const { mutate: handleAddFriend } = useAddFriend();
  const renderFriendStatus = (user: IUser) => {
    if (friend?.friendRequestsSend?.some((f) => f === user._id)) {
      return "Request was send";
    }

    if (friend?.friends?.some((f) => f.userId === user._id)) {
      return (
        <div className="flex items-center gap-2">
          <User size={20} />
          <span>Friend</span>
        </div>
      );
    }
    return "Send request";
  };

  return (
    <div>
      <ul className="flex flex-col gap-0.5 px-2 pb-3">
        {isLoading ? (
          <div>Loading....</div>
        ) : (
          users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/60"
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  src={user.avatar}
                  name={user.name}
                  seed={user._id}
                  size="lg"
                />

                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  disabled={
                    friend?.friendRequestsSend?.some((f) => f === user._id) ||
                    friend?.friends?.some((f) => f.userId === user._id)
                  }
                  onClick={() => handleAddFriend({ friendId: user._id || "" })}
                  className="cursor-pointer"
                >
                  {renderFriendStatus(user)}
                </Button>
              </div>
            </li>
          ))
        )}

        {!isLoading && users.length === 0 ? (
          <li className="px-4 py-12 text-center text-sm text-muted-foreground">
            {t("friends.empty")}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default SearchFriends;
