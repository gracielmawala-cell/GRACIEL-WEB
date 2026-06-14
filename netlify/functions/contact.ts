import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { contacts } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const [contact] = await db
      .insert(contacts)
      .values({ name, email, message })
      .returning();

    return Response.json(contact, {
      status: 201,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Contact insert error:", err);
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
};

export const config: Config = {
  path: "/api/contact",
};
