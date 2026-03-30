import BottomNav from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <main className="min-h-screen pb-24">{children}</main>
      <BottomNav />
    </>
  );
}
