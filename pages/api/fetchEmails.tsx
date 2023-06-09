import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { sessionID } = req.body;
      const response = await axios.post(
        "https://dropmail.me/api/graphql/web-test-20230602QuMvA",
        {
          query: `
            query {
              session(id: "${sessionID}") {
                mails {
                  fromAddr
                  text
                  headerSubject
                }
              }
            }
          `,
        }
      );

      if (response.data?.data?.session) {
        const mails = response.data.data.session.mails;
        res.status(200).json({ mails });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
