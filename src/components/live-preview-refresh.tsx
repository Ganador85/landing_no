"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LivePreviewRefresh() {
  const router = useRouter();
  const [serverURL, setServerURL] = useState<string>();

  useEffect(() => {
    setServerURL(window.location.origin);
  }, []);

  if (!serverURL) return null;

  return <RefreshRouteOnSave refresh={router.refresh} serverURL={serverURL} />;
}
