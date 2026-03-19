import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function CyberCard({ title, icon: Icon, children, className = "" }: Props) {
  return (
    <div className={`bg-card cyber-border accent-bar-left overflow-hidden p-5 cyber-glow ${className}`}>
      <div className="flex items-center gap-2 mb-4 text-primary font-label text-[11px] font-bold pl-2">
        <Icon size={14} />
        {title}
      </div>
      <div className="pl-2">{children}</div>
    </div>
  );
}
