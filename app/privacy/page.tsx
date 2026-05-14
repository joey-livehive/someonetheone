import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 캐스팅',
};

async function getMarkdownContent() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'privacy-policy.md');
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading privacy policy markdown:', error);
    return null;
  }
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="mt-6 mb-2 text-lg font-semibold text-[var(--ink)]">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="mt-8 mb-3 text-xl font-bold text-[var(--ink)]">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="mb-6 text-3xl font-bold text-[var(--ink)]">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[var(--ink)]">$1</strong>')
    .replace(/^- (.*$)/gim, '<li class="ml-5 mb-1 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-5 mb-1 list-decimal">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--orange)] hover:underline">$1</a>')
    .replace(/\|.*\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map((cell) => cell.trim());
      if (cells.every((cell) => /^-+$/.test(cell))) {
        return '';
      }
      return `<tr>${cells.map((cell) => `<td class="border border-[#E4D8C4] px-3 py-2 align-top text-sm">${cell}</td>`).join('')}</tr>`;
    })
    .replace(/\n\n/g, '</p><p class="mb-4 text-[var(--ink-soft)]">')
    .replace(/\n/g, '<br/>');
}

export default async function PrivacyPage() {
  const content = await getMarkdownContent();

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--sto-bg)] px-5 py-10 text-[var(--ink-soft)]">
      <article
        className="mx-auto max-w-3xl rounded-lg border border-[#E4D8C4] bg-white p-6 leading-7 shadow-sm sm:p-10"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
      />
    </main>
  );
}
