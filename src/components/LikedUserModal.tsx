import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface LikedUsersModalProps {
  users: { id: string; name: string; username: string; image: string | null }[];
  onClose: () => void;
}

const LikedUsersModal: React.FC<LikedUsersModalProps> = ({ users, onClose }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Liked by</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">No likes yet</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <Avatar className="size-8">
                  <AvatarImage src={user.image ?? "/avatar.png"} />
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default LikedUsersModal;
