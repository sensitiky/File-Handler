import { put } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're using formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error", err);
        return res.status(500).json({ message: "Form parsing error" });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file) {
        console.error("No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        const fileStream = fs.createReadStream(file.filepath);

        // Upload the file using the put method from @vercel/blob
        const blob = await put(file.originalFilename || '', fileStream, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN, // Securely access the token
        });

        return res.status(200).json(blob);
      } catch (error) {
        console.error("Upload failed", error);
        return res.status(500).json({ message: "Upload failed" });
      }
    });
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}