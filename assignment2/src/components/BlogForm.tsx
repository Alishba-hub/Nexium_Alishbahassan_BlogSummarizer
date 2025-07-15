'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (url: string) => void;
}

export default function BlogForm({ onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    await onSubmit(url);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter blog URL"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Summarising…" : "Summarise"}
      </Button>
    </form>
  );
}
