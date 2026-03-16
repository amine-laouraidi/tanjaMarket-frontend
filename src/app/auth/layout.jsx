import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 w-fit mb-6"
      >
        <RiArrowLeftLine size={13} />
        Retour à l'accueil
      </Link>

      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
