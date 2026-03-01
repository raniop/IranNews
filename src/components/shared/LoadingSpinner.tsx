interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizeMap[size]} border-2 border-zinc-300 dark:border-zinc-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin`}
      />
      {label && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      )}
    </div>
  );
}
