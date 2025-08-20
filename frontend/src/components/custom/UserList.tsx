/**
 * User list item component - displays individual user in the user list
 */

import { User } from "@src/pages/Home";
import { useNavigate } from "react-router-dom";

const UserList = (user: User) => {
  const navigate = useNavigate();

  return (
    <li
      className="flex w-full max-w-md cursor-pointer flex-col justify-between rounded-lg border p-4 shadow-lg hover:bg-gray-100 sm:flex-row sm:items-center"
      onClick={() => navigate(`user/${user._id}`)}
    >
      {/* User username */}
      <span>{user.username}</span>
      {/* User role */}
      <span>{user.roles}</span>
    </li>
  );
};

export default UserList;
