// Owner 시점 매칭 리포트 페이지 (PR 2 commit 2 — 골격만).
//
// 라우트: /connection/casting/{uid}
// perspective: 'owner'  (PROMPT_ARCHITECTURE.md v4 § 1 / § 3)
//
// 본 commit 은 빈 페이지 mock 만. 실제 ConnectionReport 조립 + API fetch +
// 컴포넌트 마운트는 commit 3 (owner 매칭 페이지) 에서.

type PageProps = {
  params: Promise<{ uid: string }>;
};

export default async function OwnerCastingPage({ params }: PageProps) {
  const { uid } = await params;
  return (
    <main style={{ padding: '40px 24px', maxWidth: 720, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>Owner 매칭 리포트</h1>
      <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>
        connection_uid: <code>{uid}</code>
      </p>
      <p style={{ color: '#999', fontSize: 13, marginTop: 24 }}>
        Coming soon — PR 2 commit 3 에서 ConnectionReport(perspective=&apos;owner&apos;) 조립.
      </p>
    </main>
  );
}
