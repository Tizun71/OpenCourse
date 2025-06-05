import Link from "next/link";

export default function msgWithLink(text: string) {
  const urlRegex = /http:\/\/localhost:3000\/course\/([a-zA-Z0-9_-]+)/;
  const match = text.match(urlRegex);
  const cleanedText = text.replace(urlRegex, "").trim();
  return (
    <div>
      <p className="leading-relaxed">{cleanedText}</p>
      {match && (
        <Link href={`/course/${match[1]}`} className="text-blue-500 underline">
          Xem khóa học
        </Link>
      )}
    </div>
  );
}
