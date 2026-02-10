import { useState, useCallback } from "react";
import { User, UserFormData } from "@/config/userSchema";
import { toast } from "@/hooks/use-toast";

// Mock API delay for realistic feel
const API_DELAY = 500;

// Simulated API functions - replace with actual API calls
const mockApi = {
  getUsers: (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem("users");
        resolve(stored ? JSON.parse(stored) : []);
      }, API_DELAY);
    });
  },

  createUser: (data: UserFormData): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const stored = localStorage.getItem("users");
        const users: User[] = stored ? JSON.parse(stored) : [];
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        resolve(newUser);
      }, API_DELAY);
    });
  },

  updateUser: (id: string, data: UserFormData): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem("users");
        const users: User[] = stored ? JSON.parse(stored) : [];
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error("User not found"));
          return;
        }
        users[index] = {
          ...users[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("users", JSON.stringify(users));
        resolve(users[index]);
      }, API_DELAY);
    });
  },

  deleteUser: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem("users");
        const users: User[] = stored ? JSON.parse(stored) : [];
        const filtered = users.filter((u) => u.id !== id);
        localStorage.setItem("users", JSON.stringify(filtered));
        resolve();
      }, API_DELAY);
    });
  },
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      const newUser = await mockApi.createUser(data);
      setUsers((prev) => [...prev, newUser]);
      toast({
        title: "Success",
        description: "User created successfully.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: UserFormData) => {
    setIsSubmitting(true);
    try {
      const updated = await mockApi.updateUser(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setIsSubmitting(true);
    try {
      await mockApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    users,
    isLoading,
    isSubmitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
