import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

// Expose the endpoint /api/reset-database to reset the nodes and edges
// Obviously, should be deleted if deployed somewhere
export async function GET(request: Request) {
  await sql`DROP TABLE edges, nodes`;

  await sql`CREATE TABLE IF NOT EXISTS nodes (
    id varchar(21) PRIMARY KEY,
    x float NOT NULL,
    y float NOT NULL,
    color varchar(7) NOT NULL,
    doc_id varchar(50) NOT NULL
  );`;

  await sql`CREATE TABLE IF NOT EXISTS edges (
    id varchar(21) PRIMARY KEY,
    source varchar(21) NOT NULL,
    target varchar(21) NOT NULL,
    doc_id varchar(50) NOT NULL,

    CONSTRAINT fk_source
      FOREIGN KEY(source) 
        REFERENCES nodes(id),

    CONSTRAINT fk_target
      FOREIGN KEY(target) 
        REFERENCES nodes(id)
  );`;

  await Promise.all([
    generateSimpleFlow("collaborative"),
    generateSimpleFlow("not-collaborative"),
  ]);

  return NextResponse.json({ message: "Database reset successful" });
}

async function generateSimpleFlow(id: string) {
  const nodeA = nanoid();
  const nodeB = nanoid();
  const nodeC = nanoid();

  await sql`INSERT INTO nodes (id, x, y, color, doc_id) VALUES
    (${nodeA}, 250, 25, '#4FD1C5', ${id}),
    (${nodeB}, 100, 125, '#F6E05E', ${id}),
    (${nodeC}, 250, 250, '#B794F4', ${id})`;

  await sql`INSERT INTO edges VALUES
    (${nanoid()}, ${nodeA}, ${nodeB}, ${id}),
    (${nanoid()}, ${nodeB}, ${nodeC}, ${id})`;
}
