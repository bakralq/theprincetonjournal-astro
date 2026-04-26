export type AuthorProfile = {
  name: string;
  slug: string;
  role?: string;
  bio: string;
};

const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  'Christian J. Remington, Editor': {
    name: 'Christian J. Remington',
    slug: 'christian-j-remington',
    role: 'Editor',
    bio: 'Christian J. Remington covers Princeton city government, growth, development, public safety, and other issues that shape daily life in Princeton, Texas.',
  },
};

export const getAuthorProfile = (author?: string | null): AuthorProfile | null => {
  if (!author) {
    return null;
  }

  return AUTHOR_PROFILES[author] ?? null;
};

export const getAuthorProfileUrl = (author?: string | null): string | null => {
  const profile = getAuthorProfile(author);

  if (!profile) {
    return null;
  }

  return `/authors/${profile.slug}`;
};
