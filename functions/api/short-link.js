const SHORT_LINK_ORIGIN = "https://ue.lc";
const SINK_TOKEN = "Wang8278Tasv";

export async function onRequestPost(context) {
  let payload;

  try {
    payload = await context.request.json();
  } catch {
    return json({ error: "请求格式错误" }, 400);
  }

  const url = typeof payload.url === "string" ? payload.url.trim() : "";
  const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";

  if (!url) {
    return json({ error: "请输入长链接" }, 400);
  }

  const upstream = await fetch(`${SHORT_LINK_ORIGIN}/api/link/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SINK_TOKEN}`
    },
    body: JSON.stringify({
      url,
      ...(slug ? { slug } : {})
    })
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return json(data, upstream.status);
  }

  const generatedSlug = data.link ? data.link.slug : "";
  return json({
    ...data,
    shortUrl: generatedSlug ? `${SHORT_LINK_ORIGIN}/${generatedSlug}` : ""
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}
