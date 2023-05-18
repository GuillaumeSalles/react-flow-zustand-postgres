import { createKysely } from "@vercel/postgres-kysely";

interface Database {
  nodes: {
    id: string;
    x: number;
    y: number;
    color: string;
    doc_id: string;
  };
  edges: {
    id: string;
    source: string;
    target: string;
    doc_id: string;
  };
}

export function getDatabase() {
  return createKysely<Database>();
}
