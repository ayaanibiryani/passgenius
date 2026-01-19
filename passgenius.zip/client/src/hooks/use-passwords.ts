import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertSavedPassword } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePasswords() {
  return useQuery({
    queryKey: [api.passwords.list.path],
    queryFn: async () => {
      const res = await fetch(api.passwords.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch passwords");
      return api.passwords.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePassword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSavedPassword) => {
      const res = await fetch(api.passwords.create.path, {
        method: api.passwords.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.passwords.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to save password");
      }
      return api.passwords.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.passwords.list.path] });
      toast({
        title: "Securely Saved",
        description: "Password has been added to your vault.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

export function useDeletePassword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.passwords.delete.path, { id });
      const res = await fetch(url, {
        method: api.passwords.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Password not found");
        throw new Error("Failed to delete password");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.passwords.list.path] });
      toast({
        title: "Deleted",
        description: "Password removed from vault.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}
