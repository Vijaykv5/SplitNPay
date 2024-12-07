"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "../components/NavBar";
import { Plus, Minus } from "lucide-react";
import { Footer } from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";

export default function CreateGroupPage() {
  const [participants, setParticipants] = useState([""]);
  const [splitType, setSplitType] = useState("equal");
//   const {publicKey, disconnect} = useWallet();
  const addParticipant = () => {
    setParticipants([...participants, ""]);
  };
  const removeParticipant = (index: number) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };
  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };
  return (
    <ProtectedRoute>
       
      <div className="relative min-h-screen overflow-hidden bg-[#F8F8FF]">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />
        <SiteHeader />
        <main className="relative pt-32">
          <motion.div
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-white rounded-[2rem] shadow-xl p-8">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Create a Group Payment
              </h1>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input id="groupName" placeholder="e.g., Trip to NYC" />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="Enter total amount"
                  />
                </div>
                <div>
                  <Label>Participants</Label>
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <Input
                        value={participant}
                        onChange={(e) =>
                          handleParticipantChange(index, e.target.value)
                        }
                        placeholder="Wallet address or invite link"
                        className="flex-grow"
                      />
                      {index === participants.length - 1 ? (
                        <Button
                          type="button"
                          onClick={addParticipant}
                          className="ml-2"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="ml-2"
                          variant="outline"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <Label>Split Type</Label>
                  <RadioGroup
                    defaultValue="equal"
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal" id="equal" />
                      <Label htmlFor="equal">Equal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom</Label>
                    </div>
                  </RadioGroup>
                </div>
                {splitType === "custom" && (
                  <div>
                    <Label htmlFor="customSplit">Custom Split Details</Label>
                    <Textarea
                      id="customSplit"
                      placeholder="Enter custom split details"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#14153F] text-white rounded-full py-6 text-base hover:bg-[#14153F]/90 transition-colors"
                >
                  Create Group Payment
                </Button>
              </form>
            </div>
          </motion.div>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}