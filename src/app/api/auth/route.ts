import { authorize } from "@liveblocks/node";
import { NextResponse } from "next/server";

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

export async function POST(request: Request) {
  if (!API_KEY) {
    return NextResponse.error();
  }

  const { room } = await request.json();

  // For the avatar example, we're generating random users
  // and set their info from the authentication endpoint
  // See https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
  const userIndex = Math.floor(Math.random() * NAMES.length);
  const response = await authorize({
    room,
    secret: API_KEY,
    userId: `user-${userIndex}`,
    userInfo: {
      name: NAMES[userIndex],
      picture: `https://liveblocks.io/avatars/avatar-${Math.floor(
        Math.random() * 30
      )}.png`,
    },
  });
  return new Response(response.body, { status: response.status });
}

const NAMES = [
  "Charlie Layne",
  "Mislav Abha",
  "Tatum Paolo",
  "Anjali Wanda",
  "Jody Hekla",
  "Emil Joyce",
  "Jory Quispe",
  "Quinn Elton",
];
