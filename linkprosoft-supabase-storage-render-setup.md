# Linkprosoft — Supabase Storage (S3) + Render Backend Setup

A concise guide for connecting the Linkprosoft backend hosted on Render to Supabase Storage through its S3-compatibble API.

## 1. Create and configure storage

1. Open your Supabase project → **Storage**.
2. Create a bucket (recommended: `linkprosoft-media`).
3. Keep the bucket **private** by default. Use a public bucket only for assets intentionally visible to everyone.
4. Open **Project Settings → Storage → S3 Connection** and enable the S3 protocol.
5. Generate an S3 access key ID and secret access key. Copy the endpoint and region shown in the dashboard. The secret is shown only once.

> Supabase S3 access keys grant broad access to Storage and bypass Storage RLS. Use them only from the backend; never expose them in frontend code or public environment variables.

## 2. Install the AWS S3 SDK

From the backend project directory:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## 3. Configure Render environment variables

In **Render → your backend Web Service → Environment**, add:

```env
SUPABASE_S3_ENDPOINT=https://<project-ref>.storage.supabase.co/storage/v1/s3
SUPABASE_S3_REGION=<region-from-supabase>
SUPABASE_S3_ACCESS_KEY_ID=<generated-access-key-id>
SUPABASE_S3_SECRET_ACCESS_KEY=<generated-secret-access-key>
SUPABASE_S3_BUCKET=linkprosoft-media
```

Use the endpoint and region values copied from Supabase's S3 Connection settings. Save the environment changes and redeploy/restart the service. Do not commit these values to Git or place them in client-side environment variables.

## 4. Create the S3 client (Node.js / TypeScript)

Create a shared server-only module, for example `src/config/storage.ts`:

```ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.SUPABASE_S3_ENDPOINT!,
  region: process.env.SUPABASE_S3_REGION!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
  },
});

export const mediaBucket = process.env.SUPABASE_S3_BUCKET!;
```

Fail fast at application startup if any required environment variable is missing.

## 5. Upload, retrieve, and delete

Use S3 commands in a backend media service. Example upload:

```ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, mediaBucket } from "../config/storage";

export async function uploadMedia(
  key: string,
  body: Buffer,
  contentType: string,
) {
  await s3.send(new PutObjectCommand({
    Bucket: mediaBucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));

  return { key };
}
```

For private media, create short-lived signed download URLs with `GetObjectCommand` and `getSignedUrl`. For intentionally public assets, use the Supabase public object URL pattern or the Storage dashboard's public URL option. Deletion uses `DeleteObjectCommand`.

Persist the **object key** (and useful metadata such as MIME type, size, and owning user/entity) in Linkprosoft's database—not the file bytes. Keep key generation controlled by the backend, e.g. `users/<userId>/avatars/<uuid>.<ext>` or `projects/<projectId>/attachments/<uuid>.<ext>`.

## 6. Security and implementation checklist

- Authenticate the requester and authorize access to the target entity before upload, retrieval, or deletion.
- Validate allowed MIME types and file extensions; do not trust the client-provided `Content-Type`.
- Enforce per-file and per-request size limits; use multipart upload or signed upload flows for large files where appropriate.
- Generate unique object keys server-side; avoid user-supplied paths and filename collisions.
- Use signed URLs with short expiry for private files. Avoid making private buckets public.
- Add cleanup for orphaned objects when a database operation fails or a record is deleted.
- Keep the S3 credentials backend-only; rotate them if exposed.
- Test upload, download URL access, unauthorized access, and deletion on the deployed Render service.

## Official references

- [Supabase S3 compatibility](https://supabase.com/docs/guides/storage/s3/compatibility)
- [Supabase S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication)
- [Supabase S3 uploads](https://supabase.com/docs/guides/storage/uploads/s3-uploads)
