const SHORT_LINK_ORIGIN = "https://ue.lc";

export async function onRequestPost(context) {
  let payload;

  try {
    payload = await context.request.json();
  } catch {
    return json({ error: "请求格式错误" }, 400);
  }

  const link = typeof payload.link === "string" ? payload.link.trim() : "";
  const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";

  if (!link) {
    return json({ error: "请输入长链接" }, 400);
  }

  const upstream = await fetch(`${SHORT_LINK_ORIGIN}/api/set-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      link,
      ...(slug ? { slug } : {})
    })
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return json(data, upstream.status);
  }

  const id = data.id || data.existingId;
  return json({
    ...data,
    shortUrl: id ? `${SHORT_LINK_ORIGIN}/${id}` : ""
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
