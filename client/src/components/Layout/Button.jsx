import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        element: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600',
        ghost: 'hover:bg-white/10 hover:text-white',
        fantasy: 'relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 border-2 border-yellow-300 shadow-lg transform transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = ({ className, variant, size, fullWidth, ...props }) => {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }), fullWidth ? 'w-full' : '')} // Add 'w-full' if fullWidth is true
      {...props}
    />
  );
};

export { Button, buttonVariants };
