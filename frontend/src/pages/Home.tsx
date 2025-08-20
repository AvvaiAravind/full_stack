import UserList from "@src/components/custom/UserList";
import api from "@src/lib/axios";
import { useCallback, useEffect, useState } from "react";

export type User = {
  _id: string;
  username: string;
  roles: string;
};

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="mx-auto h-full w-full max-w-md">
      <h1 className="text-center text-2xl font-bold">Users</h1>
      {isLoading && <p className="text-center">Loading...</p>}

      {!isLoading && users.length === 0 && (
        <p className="text-center">No users found</p>
      )}

      {!isLoading && users.length > 0 && (
        <ul className="mt-4 flex h-full w-full flex-col items-center gap-2">
          {users.map((user) => (
            <UserList key={user._id} {...user} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
