import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public?.siteUrl || 'http://localhost:3000'

  const articles = await queryCollection(event, 'articles')
    .order('publishedAt', 'DESC')
    .limit(50)
    .all()

  const siteName = config.public?.siteName || 'Site'

  const rssItems = articles
    .map((article: any) => {
      const link = `${siteUrl}${article.path}`
      const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : ''
      return `    <item>
      <title><![CDATA[${article.title || ''}]]></title>
      <link>${link}</link>
      <description><![CDATA[${article.description || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>${siteName} - Latest Articles</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return rss
})
