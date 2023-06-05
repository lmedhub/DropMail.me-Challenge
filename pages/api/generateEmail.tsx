import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const response = await axios.post(
        "https://dropmail.me/api/graphql/web-test-20230602QuMvA",
        {
          query: `
            mutation {
              introduceSession {
                id,
                expiresAt,
                addresses {
                  address
                }
              }
            }
          `,
        }
      );

      const { data } = response.data;
      const { addresses, expiresAt } = data.introduceSession;
      const generatedEmail = addresses[0].address;
      const generatedSessionID = data.introduceSession.id;
      const expiration = new Date(expiresAt).getTime();

      res.status(200).json({
        generatedEmail,
        generatedSessionID,
        expiration,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
