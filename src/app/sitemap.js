export default function sitemap() {
  const baseUrl = 'https://kanyasahayata.org';
  const lastModified = new Date();

  return [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/education`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/medical`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/domestic`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/career`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/legal-aid`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mental-health`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/ngos`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/donate`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
