import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center p-4">
      <Image
        src="/codify.svg"
        alt="Codify LMS Logo"
        width={120}
        height={40}
      />
    </Link>
  );
};

export default Logo;