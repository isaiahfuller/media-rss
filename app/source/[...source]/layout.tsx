import Navbar from '@/components/Navbar/Navbar';

export default async function SourceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
