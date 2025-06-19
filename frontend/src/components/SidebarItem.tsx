import Link from 'next/link';
import { IconType } from 'react-icons';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `
        flex
        flex-row
        h-auto
        items-center
        w-full
        gap-x-4
        text-md
        font-medium
        cursor-pointer
        transition
        p-3
        rounded-xl
        group
        `,
        'text-[#FFFFFF] hover:bg-white/10',
        active && 'bg-[#FFFFFF] text-[#5A3D80]'
      )}
    >
      <Icon size={26} className={twMerge(
        'text-[#FFFFFF]',
        active && 'text-[#5A3D80]'
      )} />
      <p className={twMerge(
        "truncate w-full",
        active && 'text-[#5A3D80]'
      )}>{label}</p>
    </Link>
  );
};

export default SidebarItem;