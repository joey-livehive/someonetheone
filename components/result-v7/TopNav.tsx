export function TopNav({ publishedAt }: { publishedAt: string }) {
  return (
    <div className="topbar">
      <div className="logo">
        someonetheone<span className="dot">.</span>
      </div>
      <div className="meta-top">{publishedAt} · MATCH NO. 04293</div>
    </div>
  );
}
