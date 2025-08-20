/**
 * User detail page component - displays, edits, and deletes individual users
 */

import UserForm, { UserInput } from "@src/components/custom/UserForm";
import { Button } from "@src/components/ui/button";
import api from "@src/lib/axios";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// User type definition with role constraints
export type IUser = {
  _id: string;
  username: string;
  roles: "super-admin" | "admin" | "user";
  native: string;
};

const User = () => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { _id } = useParams();

  /**
   * Fetch user data by ID from the API
   */
  const handleGetUserById = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/users/${_id}`);
      setUserData(response.data);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [_id]);

  /**
   * Handle user data updates
   * @param data - Updated user data from form
   */
  const handleEditUser = useCallback(
    async (data: UserInput) => {
      if (!_id) return;

      setIsLoading(true);
      try {
        await api.patch(`/api/users/${_id}`, data);
        handleGetUserById();
        setIsEditing(false);
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [handleGetUserById, _id]
  );

  /**
   * Handle user deletion
   */
  const handleDeleteUser = useCallback(async () => {
    if (!_id) return;

    setIsLoading(true);
    try {
      await api.delete(`/api/users/${_id}`);
      navigate("/home");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [_id]);

  // Load user data on component mount
  useEffect(() => {
    if (_id) {
      handleGetUserById();
    }
  }, [handleGetUserById]);

  // Loading state
  if (!userData) {
    return (
      <div className="w-full p-4">
        <div className="mb-4 flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* User editing modal */}
      {isEditing && userData && (
        <UserForm
          user={userData}
          onSubmit={handleEditUser}
          isLoading={isLoading}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}

      <div className="w-full">
        {/* Header with navigation and actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            className="border-black text-sm hover:cursor-pointer sm:text-base"
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-center text-sm font-bold sm:text-2xl">
            User Details
          </h1>

          <Button
            className="text-sm hover:cursor-pointer sm:text-base"
            type="button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </div>

        {/* User information display */}
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Delete button */}
            <Button
              className="justify-self-end border-none sm:col-span-2"
              type="button"
              variant="outline"
              onClick={handleDeleteUser}
            >
              <Trash className="h-4 w-4" />
            </Button>

            {/* User details - left column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Username
                </label>
                <p className="text-lg font-semibold">{userData.username}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Role
                </label>
                <p className="text-lg font-semibold capitalize">
                  {userData.roles}
                </p>
              </div>
            </div>

            {/* User details - right column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Native
                </label>
                <p className="text-lg font-semibold">{userData.native}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  User ID
                </label>
                <p className="font-mono text-sm text-gray-500">
                  {userData._id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
