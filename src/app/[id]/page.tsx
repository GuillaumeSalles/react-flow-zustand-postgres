import Editor from "@/components/Editor";

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="h-screen w-screen">
      <Editor id={params.id} />
    </main>
  );
}
