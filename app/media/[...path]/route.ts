import { get } from "@vercel/blob";

type MediaRouteProps = {
  params: Promise<{
    path: string[];
  }>;
};

const blobAccess =
  process.env.BLOB_ACCESS === "public" ? "public" : "private";

export async function GET(_request: Request, { params }: MediaRouteProps) {
  const { path } = await params;
  const pathname = path.join("/");

  const result = await get(pathname, {
    access: blobAccess,
    useCache: false,
  });

  if (!result || !result.stream) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  result.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(result.stream, {
    status: 200,
    headers,
  });
}
