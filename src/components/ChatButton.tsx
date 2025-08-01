'use client';
import chatIcon from '../../public/assets/images/chatIcon.png';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from "next/image";

interface ChatButtonProps {
  vendorEmail: string;
  vendorName: string;
  className?: string;
}

const ChatButton = ({ vendorEmail, vendorName, className = '' }: ChatButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleChatClick = () => {
    if (!session?.user?.email) {
      toast.error('Please login to start a chat');
      router.push('/login');
      return;
    }

    if (session.user.email === vendorEmail) {
      toast.error('You cannot chat with yourself');
      return;
    }

    // Navigate to chat page with vendor info
    const query = new URLSearchParams({
      vendor: vendorEmail,
      vendorName: vendorName
    });
    
    router.push(`/chat?${query.toString()}`);
  };

  return (
    <button
      onClick={handleChatClick}
      className={`flex items-center w-[165px] justify-center gap-2 h-[48px] cursor-pointer bg-[#FFEEBE] text-white rounded-lg hover:bg-[#033d32] transition-colors ${className}`}
    >
      <span className="text-[#461602] text-[14px] font-semibold">Chat with {vendorName}</span>
      <Image src={chatIcon} alt={'image'}></Image>
    </button>
  );
};

export default ChatButton;