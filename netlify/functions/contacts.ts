import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { contacts } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const allContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));

    return Response.json(allContacts, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Contacts fetch error:", err);
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
};

export const config: Config = {
  path: "/api/contacts",
};
