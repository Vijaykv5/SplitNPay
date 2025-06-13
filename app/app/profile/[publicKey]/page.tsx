"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../../components/NavBar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import { toast } from "sonner";
import { useUser } from "@civic/auth-web3/react";

export default function ProfilePage() {
  const { publicKey } = useParams();
  const router = useRouter();
  const userContext = useUser();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinGroupId, setJoinGroupId] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch groups where the user's public key is a member
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("public_key", publicKey);

        if (error) {
          setError("Error fetching groups");
          console.error(error);
        } else {
          setGroups(data || []);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (publicKey) {
      fetchGroups();
    }
  }, [publicKey]);

  const handleCreateGroup = () => {
    if (!userContext.user) {
      toast.error("Please sign in to create a group");
      return;
    }
    router.push('/create-group');
  };

  const handleJoinGroup = async () => {
    if (!userContext.user) {
      toast.error("Please sign in to join a group");
      return;
    }

    if (!joinGroupId.trim()) {
      setModalError("Please enter a group ID");
      return;
    }

    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", joinGroupId)
      .single();

    if (error || !data) {
      setModalError("Invalid group ID.");
    } else {
      router.push(`/group/${joinGroupId}`);
      setIsModalOpen(false);
    }
  };

  const copyToClipboard = () => {
    if (publicKey) {
      if (typeof publicKey === "string") {
        navigator.clipboard.writeText(publicKey);
        toast.success("Public key copied to clipboard!");
      } else {
        toast.error("Failed to copy public key.");
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />

        <div className="h-40 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500" />

        <div className="container mx-auto px-4 py-8 -mt-20">
          <Card className="mb-8 p-6 bg-white shadow-lg rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "relative h-20 w-20 rounded-full overflow-hidden",
                    "border-4 border-white shadow-md"
                  )}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZi7OIPEnSno1cZkt5t6MnrSk1AEXTIjwJqg&s"
                    alt="Profile picture"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    {publicKey}{" "}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 text-xs text-emerald-600 border-emerald-500"
                    onClick={copyToClipboard}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all"
                  onClick={handleCreateGroup}
                >
                  Create group
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-100 text-emerald-600 border-emerald-500 shadow-md transition-all"
                  onClick={() => setIsModalOpen(true)}
                >
                  Join group
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-800">My Groups</h2>
            {loading ? (
              <p>Loading groups...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : groups.length === 0 ? (
              <p>No groups found. Create or join a group!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <Card
                    key={group.id}
                    className="relative p-6 bg-white border border-gray-200 shadow-md rounded-xl transition-all hover:shadow-lg hover:bg-gray-50"
                    onClick={() => router.push(`/group/${group.id}`)}
                  >
                    <div
                      className={`absolute top-2 right-2 py-1 px-3 rounded-xl text-white text-sm ${
                        group.status === "active"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {group.status === "active" ? "Closed" : "Open"}
                    </div>

                    <div className="h-full flex flex-col items-center justify-center text-gray-600">
                      <span className="text-4xl mb-2">🚀</span>

                      <span className="font-medium text-lg">
                        {group.group_name}
                      </span>

                      <p className="text-sm text-center text-gray-500 mt-2">
                        {group.group_description ||
                          "Join us for some exciting discussions!"}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4">Join Group</h2>
              <input
                type="text"
                placeholder="Enter Group ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                value={joinGroupId}
                onChange={(e) => setJoinGroupId(e.target.value)}
              />
              {modalError && (
                <p className="text-red-500 text-sm mb-4">{modalError}</p>
              )}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleJoinGroup}
                >
                  Join
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-100 text-emerald-600 border-emerald-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
