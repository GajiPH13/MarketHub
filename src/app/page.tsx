import { SessionTest } from "@/components/auth/session-test";

export default function HomePage() {
  return (
    <main>
      <h1>MarketHub</h1>
      <SessionTest />
    </main>
  );
}