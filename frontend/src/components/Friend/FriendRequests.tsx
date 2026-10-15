import IUser from "@/interfaces/user";
import UserAvatar from "../UserAvatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import useAcceptDelineFriend from "@/hooks/useAcceptDelineFriend";

interface Props {
  requests: IUser[];
  isLoading: boolean;
}

function FriendRequests({ requests, isLoading }: Props) {
  const { t } = useTranslation();
  const { mutate: handleAcceptFriend, isPending: isLoadingAccept } =
    useAcceptDelineFriend("accept");
  const { mutate: handleDelineFriend, isPending: isLoadingDeline } =
    useAcceptDelineFriend("deline");

  return (
    <div>
      <ul className="flex flex-col gap-0.5 px-2 pb-3">
        {isLoading ? (
          <div>Loading....</div>
        ) : (
          requests.map((user) => (
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
                  variant="secondary"
                  disabled={isLoadingAccept || isLoadingDeline}
                  onClick={() => handleDelineFriend(user._id || "")}
                  className="cursor-pointer"
                >
                  {t("friends.requests.decline")}
                </Button>
                <Button
                  disabled={isLoadingAccept || isLoadingDeline}
                  onClick={() => handleAcceptFriend(user._id || "")}
                  className="cursor-pointer"
                >
                  {t("friends.requests.accept")}
                </Button>
              </div>
            </li>
          ))
        )}

        {!isLoading && requests.length === 0 ? (
          <li className="px-4 py-12 text-center text-sm text-muted-foreground">
            {t("friends.requests.emptyTitle")}
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default FriendRequests;
