export const postsQueryKey = (organizationId: string) =>
  ['posts', organizationId] as const;
export const postQueryKey = (postId: string) => ['post', postId] as const;
