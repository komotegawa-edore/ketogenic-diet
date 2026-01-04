import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pt-20 md:pb-0">
        <main className="max-w-lg mx-auto px-4 py-6">
          {children}
        </main>
      </div>
      <Header />
    </ProtectedRoute>
  );
}
