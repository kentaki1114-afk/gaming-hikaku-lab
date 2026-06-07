import Link from "next/link";
import { Fragment } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function ArticleRichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const [, label, href] = match;
    if (href.startsWith("/")) {
      parts.push(
        <Link key={key++} href={href} className="text-violet-400 hover:underline">
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
          {label}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <>{parts}</>;
}
