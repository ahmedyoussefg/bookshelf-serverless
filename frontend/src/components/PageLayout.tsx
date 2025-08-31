import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      {children}
    </div>
  );
}

export default PageLayout;
