import UserForm, { UserInput } from "@src/components/custom/UserForm";
import UserList from "@src/components/custom/UserList";
import { Button } from "@src/components/ui/button";
import api from "@src/lib/axios";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type User = {
  _id: string;
  username: string;
  roles: string;
};

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = useCallback(async (data: UserInput) => {
    setIsLoading(true);
    try {
      if (data.password === "") {
        toast.error("while creating user, password should not be empty");
        return;
      }
      const response = await api.post("/api/users", data);
      setUsers((prev) => [...prev, response.data]);
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <UserForm
          onSubmit={handleAddUser}
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      <div className="mx-auto h-full w-full max-w-md">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-2xl font-bold">Users</h1>
          <Button
            className="cursor-pointer"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            <Plus /> Add User
          </Button>
        </div>
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
    </>
  );
};

export default Home;
