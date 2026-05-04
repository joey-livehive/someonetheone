const WOMAN_IMAGES = ['/images/casting/casting_woman_1.webp', '/images/casting/casting_woman_2.webp'];
const MAN_IMAGES = ['/images/casting/casting_man.webp', '/images/casting/casting_man_2.webp'];

function stableIndex(seed: string | undefined, length: number): number {
  if (!seed) return 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

function pick(images: string[], seed?: string): string {
  return images[stableIndex(seed, images.length)];
}

export function candidateImageForGender(gender: unknown, seed?: string): string | undefined {
  if (gender === 'female' || gender === '여자' || gender === '여성' || gender === 'F') {
    return pick(WOMAN_IMAGES, seed);
  }
  if (gender === 'male' || gender === '남자' || gender === '남성' || gender === 'M') {
    return pick(MAN_IMAGES, seed);
  }
  return undefined;
}

export function oppositeCandidateImageForViewerGender(gender: unknown, seed?: string): string | undefined {
  if (gender === 'female' || gender === '여자' || gender === '여성' || gender === 'F') {
    return pick(MAN_IMAGES, seed);
  }
  if (gender === 'male' || gender === '남자' || gender === '남성' || gender === 'M') {
    return pick(WOMAN_IMAGES, seed);
  }
  return undefined;
}
