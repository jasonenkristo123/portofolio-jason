export const BrandLogo = ({
  className = '',
  size = 'md',
  withText = false
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-xs' },
    md: { img: 'w-10 h-10', text: 'text-sm' },
    lg: { img: 'w-14 h-14', text: 'text-base' },
    xl: { img: 'w-24 h-24', text: 'text-lg' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {withText && (
        <div className="flex flex-col text-left">
          <span className={`font-bold text-white tracking-wide leading-tight drop-shadow-sm ${currentSize.text}`}>
            Jason Enkristo
          </span>
          <span className="text-[11px] text-[#fff9d4] font-mono font-medium flex items-center gap-1 drop-shadow-xs">
            &gt;_ Full-Stack Web Developer
          </span>
        </div>
      )}
    </div>
  );
};

