export default function CustomSpacing({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-neutral-300 border-b px-[3%] sm:px-[6%]  ${className}`}>
      <div className="border-neutral-300 border-x">{children}</div>
    </div>
  );
}
