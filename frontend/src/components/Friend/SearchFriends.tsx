import IUser from "@/interfaces/user";
import UserAvatar from "../UserAvatar";
import { Button } from "@/components/ui/button";
import useAddFriend from "@/hooks/useAddFriend";
import { useTranslation } from "react-i18next";
import { IFriend } from "@/interfaces/friend";
import { Ban, User } from "lucide-react";
import useAcceptDelineFriend from "@/hooks/useAcceptDelineFriend";
import useBlockFriend from "@/hooks/useBlockFriend";

interface Props {
  friend?: IFriend;
  users: IUser[];
  isLoading: boolean;
}

function SearchFriends({ friend, users, isLoading }: Props) {
  const { t } = useTranslation();
  const { mutate: handleAddFriend } = useAddFriend();
  const { mutate: handleAcceptFriend } = useAcceptDelineFriend("accept");
  const { mutate: handleDelineFriend } = useAcceptDelineFriend("deline");
  const { mutate: handleBlockFriend } = useBlockFriend();

  const renderFriendStatus = (user: IUser) => {
    const isRequestSent = friend?.friendRequestsSend?.some(
      (f) => f === user._id,
    );
    const isFriend = friend?.friends?.some((f) => f.userId === user._id);
    const isBlocked = friend?.blockFriends.some((f) => f === user._id);
    // const unBlock =

    if (isBlocked) {
      return "Blocked";
    }
    if (isRequestSent) {
      return "Request was send";
    }
    if (isFriend) {
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
        {isLoading && <div>Loading....</div>}
        {users.map((user) => {
          const isFriendRequestSent = friend?.friendRequestsSend?.some(
            (f) => f === user._id,
          );
          const isRequestSent = friend?.friendRequests.some(
            (f) => f === user._id,
          );
          const isFriend = friend?.friends?.some((f) => f.userId === user._id);
          const isBlocked = friend?.blockFriends.some((f) => f === user._id);

          return (
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
                {isRequestSent ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelineFriend(user._id || "")}
                      className="cursor-pointer"
                    >
                      {t("friends.requests.decline")}
                    </Button>
                    <Button
                      onClick={() => handleAcceptFriend(user._id || "")}
                      className="cursor-pointer"
                    >
                      {t("friends.requests.accept")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={"ghost"}
                      disabled={isFriendRequestSent || isFriend || isBlocked}
                      onClick={() => handleBlockFriend(user._id || "")}
                      className="cursor-pointer"
                    >
                      <Ban />
                      <span>Block</span>
                    </Button>
                    <Button
                      disabled={isFriendRequestSent || isFriend || isBlocked}
                      onClick={() =>
                        handleAddFriend({ friendId: user._id || "" })
                      }
                      className="cursor-pointer"
                    >
                      {renderFriendStatus(user)}
                    </Button>
                  </>
                )}
              </div>
            </li>
          );
        })}

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
