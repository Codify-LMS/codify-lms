import { twMerge } from 'tailwind-merge';
interface BoxProps {
    children: React.ReactNode
    className?: string
}

const Box: React.FC<BoxProps> = ({children, className}) => {
    return (
        <div className={twMerge('bg-white rounded-lg h-fit w-full shadow-md', className)}>
            {children}
        </div>
    );
}
export default Box;