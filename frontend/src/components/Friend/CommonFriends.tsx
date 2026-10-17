import IUser from "@/interfaces/user";
import UserAvatar from "../UserAvatar";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import useBlockFriend from "@/hooks/useBlockFriend";
import { Ban } from "lucide-react";

interface Props {
  friends: IUser[];
  isLoading: boolean;
}

function CommonFriends({ friends, isLoading }: Props) {
  const { t } = useTranslation();
  const { mutate: handleBlockFriend } = useBlockFriend();

  return (
    <div>
      <ul className="flex flex-col gap-0.5 px-2 pb-3">
        {isLoading ? (
          <div>Loading....</div>
        ) : (
          friends.map((user) => (
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
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  {t("friends.tabs.common-friends")}
                </span>
                <Button onClick={() => handleBlockFriend(user._id || "")}>
                  <Ban />
                  <span>Block</span>
                </Button>
              </div>
            </li>
          ))
        )}

        {!isLoading && friends.length === 0 ? (
          <li className="px-4 py-12 text-center text-sm text-muted-foreground">
            {t("friends.empty")}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default CommonFriends;
