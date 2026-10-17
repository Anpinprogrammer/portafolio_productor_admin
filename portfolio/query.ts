/** Usar siempre con perspective: 'published', también al resolver referencias. */
export const portfolioProjectsQuery = /* groq */ `
  *[
    _type == "project"
    && !(_id in path("drafts.**"))
    && !(_id in path("versions.**"))
  ]
  | order(defined(order) desc, order asc, title asc, _id asc) {
    _id,
    "title": coalesce(title, "Proyecto sin título"),
    "slug": coalesce(slug.current, _id),
    "category": select(defined(category->slug.current) => category->{
      title, "slug": slug.current, icon
    }, null),
    "coverImage": select(defined(coverImage.asset->url) => {
      "url": coverImage.asset->url,
      "alt": coalesce(coverImage.alt, title)
    }, null),
    "video": select(
      video.sourceType in ["external", "direct", "upload"] => {
        "sourceType": video.sourceType,
        "url": select(
          video.sourceType == "upload" => video.videoFile.asset->url,
          video.sourceType in ["external", "direct"] => video.externalUrl,
          null
        ),
        "durationSeconds": video.durationSeconds
      },
      defined(videoUrl) => {
        "sourceType": select(videoUrl match ["*.mp4*", "*.webm*"] => "direct", "external"),
        "url": videoUrl,
        "durationSeconds": null
      },
      null
    ),
    tagline,
    "description": coalesce(description, pt::text(synopsis), ""),
    "services": coalesce((serviceReferences[]->{_id, title, "slug": slug.current})[
      defined(_id) && defined(title) && defined(slug)
    ], []),
    "legacyServices": coalesce(services, []),
    "tags": coalesce(tags, []),
    "featured": coalesce(featured, false),
    order,
    publishedAt
  }
`
