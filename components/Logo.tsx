import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Shotokan Karate Bangladesh Logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="font-bold text-xl hidden sm:inline">Shotokan Karate BD</span>
    </Link>
  );
}