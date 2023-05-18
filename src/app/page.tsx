import Link from "next/link";

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="h-screen w-screen">
      <ul>
        <li>
          <Link href={"/collaborative"}>Collaborative react flow</Link>
        </li>
        <li>
          <Link href={"/not-collaborative"}>Non collaborative react flow</Link>
        </li>
      </ul>
    </main>
  );
}
