import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Copy, Users, Shield, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ChatAnimation } from './ChatAnimation';
import { SiteHeader } from './NavBar';
import { Footer } from './Footer';
import * as Accordion from '@radix-ui/react-accordion';
import { useRouter } from 'next/navigation';
import { supabase } from "../utils/supabaseClient";
import { toast } from "sonner";
import { useUser } from "@civic/auth-web3/react";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinGroupId, setJoinGroupId] = useState("");
  const [modalError, setModalError] = useState("");
  const router = useRouter();
  const userContext = useUser();

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8F8FF]">
      {/* Background Blobs */}
      <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-3xl" />
      <div className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-100/30 blur-3xl" />
      
      <SiteHeader />

      <main className="relative">
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32 rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#FFF5F6] via-[#F5B0CA] to-[#C5A6E5] shadow-2xl">
          <div className="grid lg:grid-cols-2 min-h-[calc(100vh-9rem)]">
            <motion.div
              className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#14153F] to-[#4A4A8F]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Buy Now <br />
                Pay Together.
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg text-gray-800 mb-12 max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                SplitNPay simplifies group payments for your customers,
                making joint payments easy and secure while lowering
                acquisition costs and boosting conversion rates.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <Button 
                  className="bg-[#14153F] text-white rounded-full px-8 py-6 text-base hover:bg-[#14153F]/90 transition-colors shadow-lg hover:shadow-xl"
                  onClick={handleCreateGroup}
                >
                  Create Group
                </Button>
                <Button
                  className="bg-white text-[#14153F] rounded-full px-8 py-6 text-base hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => {
                    if (!userContext.user) {
                      toast.error("Please sign in to join a group");
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                >
                  Join Group
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="p-8 sm:p-16 lg:p-24 flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <ChatAnimation />
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <motion.div
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 rounded-[2rem] bg-[#14153F] text-white overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid lg:grid-cols-2 gap-8 p-8 sm:p-16 lg:p-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-300">
                How SplitNPay works
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Simplify Group <br />
                Payments.
              </h2>
              <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-xl">
                The organizer creates a new payment request within the
                SplitNPay app, specifying the total amount, the purpose
                (e.g., a dinner bill), and the participants.
              </p>
              <ul className="space-y-4">
                {[
                  "Manage your trip expenses with ease.",
                  "Invite friends to join your payment group.",
                  "Track payments in real-time.",
                  "Secure and transparent transactions.",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <div className="rounded-full bg-green-400/10 p-1">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="bg-gray-100 rounded-xl p-8 text-black shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-full bg-green-400 p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Payment Received
                    </h3>
                    <p className="text-gray-600">
                      All the amount will be credited to the organizers
                      account once the payment is completed.
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="font-medium">Trip to Banglore</p>
                  <div className="flex justify-between mt-2">
                    <span>Total</span>
                    <span className="font-semibold">0.8 Sol</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-center mb-4">
                    Invite others to join your payment group.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 truncate">
                      https://splitnpay...
                    </div>
                    <Button variant="default" className="bg-[white] gap-2 hover:bg-gray-50">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#14153F] mb-4">
              Powerful Features for Group Payments
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage group payments efficiently and securely
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Group Management",
                description: "Easily create and manage payment groups with customizable settings and member roles."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure Transactions",
                description: "Bank-grade security with end-to-end encryption for all your payment activities."
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Real-time Updates",
                description: "Get instant notifications and updates on payment status and group activities."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-[#14153F] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#14153F] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about SplitNPay
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion.Root
              type="single"
              collapsible
              className="space-y-4"
            >
              {[
                {
                  question: "How secure is SplitNPay?",
                  answer: "SplitNPay uses bank-grade encryption and security measures to protect all transactions and user data. We comply with industry standards and regularly update our security protocols."
                },
                {
                  question: "Can I create multiple payment groups?",
                  answer: "Yes, you can create and manage multiple payment groups simultaneously. Each group has its own unique ID and settings."
                },
                {
                  question: "Is there a limit to group size?",
                  answer: "There's no strict limit to group size, but we recommend keeping groups manageable for better coordination and tracking."
                },
                {
                  question: "How do I track payment status?",
                  answer: "You can track payment status in real-time through the dashboard. Each payment shows its current status, and you'll receive notifications for any updates."
                },
                {
                  question: "What happens if someone doesn't pay?",
                  answer: "The group will be still active untill the pooled amount is paid by all the members."
                }
              ].map((faq, index) => (
                <Accordion.Item
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <Accordion.Trigger className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors">
                    <span className="text-lg font-semibold text-[#14153F]">{faq.question}</span>
                    <ChevronDown className="h-5 w-5 text-[#14153F] transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-4 text-gray-600"
                    >
                      {faq.answer}
                    </motion.div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-[#14153F] to-[#4A4A8F] rounded-[2rem] p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Simplify Your Group Payments?
            </h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SplitNPay for their group payment needs. Get started today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/create-group">
                <Button className="bg-white text-[#14153F] rounded-full px-8 py-6 text-base hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl">
                  Get Started Now
                </Button>
              </Link>
              <Button
                className="bg-transparent border-2 border-white text-white rounded-full px-8 py-6 text-base hover:bg-white/10 transition-colors"
                onClick={() => {
                  if (!userContext.user) {
                    toast.error("Please sign in to join a group");
                    return;
                  }
                  setIsModalOpen(true);
                }}
              >
                Join Existing Group
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />

      {/* Join Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-2xl w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-[#14153F]">Join Group</h2>
            <input
              type="text"
              placeholder="Enter Group ID"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14153F] focus:border-transparent outline-none transition-all"
              value={joinGroupId}
              onChange={(e) => setJoinGroupId(e.target.value)}
            />
            {modalError && (
              <p className="text-red-500 text-sm mb-4">{modalError}</p>
            )}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-[#14153F] hover:bg-[#14153F]/90 text-white flex-1"
                onClick={handleJoinGroup}
              >
                Join
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-[#14153F] text-[#14153F] hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 