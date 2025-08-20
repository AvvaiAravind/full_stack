import { User } from "@src/pages/Home";
import { useNavigate } from "react-router-dom";

const UserList = (user: User) => {
  const navigate = useNavigate();

  return (
    <li
      className="flex w-full max-w-md cursor-pointer flex-col sm:items-center justify-between rounded-lg border p-4 shadow-lg hover:bg-gray-100 sm:flex-row"
      onClick={() => navigate(`user/${user._id}`)}
    >
      <span>{user.username}</span>
      <span>{user.roles}</span>
    </li>
  );
};

export default UserList;
