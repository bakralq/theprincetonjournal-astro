export type PostDateLike = {
  date?: string | null;
  publishedAt?: string | null;
};

const fallbackDate = '1970-01-01T00:00:00Z';

export const getPostDateObject = ({ date, publishedAt }: PostDateLike) => {
  const candidate = publishedAt || (date ? `${date}T12:00:00` : fallbackDate);
  const parsed = new Date(candidate);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date(fallbackDate);
};

export const getPostTimestamp = (value: PostDateLike) =>
  getPostDateObject(value).getTime();

export const formatPostDate = (
  value: PostDateLike,
  includeTime = false,
) => {
  const date = getPostDateObject(value);

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime
      ? {
          hour: 'numeric',
          minute: '2-digit',
        }
      : {}),
  }).format(date);
};

export const hasExplicitPublishTime = ({ publishedAt }: PostDateLike) =>
  Boolean(publishedAt && !Number.isNaN(new Date(publishedAt).getTime()));

export const calculateReadingTime = (content: string) => {
  const wordCount = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export const getReadingTime = (
  content: string,
  override?: number | null,
) => override ?? calculateReadingTime(content);
