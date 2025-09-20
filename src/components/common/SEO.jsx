import { useEffect } from 'react';

const SEO = ({
  title = 'GitFlex - Flex Your Developer Story',
  description = 'Flex your GitHub profile with GitFlex - a modern, professional showcase for developers. Real-time API integration, beautiful charts, contribution graphs, and modern design.',
  image = '/gitflex-logo.svg',
  url = '',
  username = null,
  noindex = false
}) => {
  useEffect(() => {
    const fullUrl = `https://gitflexx.vercel.app${url}`;
    const fullTitle = username ? `${username} - GitHub Profile | GitFlex` : title;
    const fullDescription = username 
      ? `Explore ${username}'s GitHub profile on GitFlex. View repositories, contributions, coding activity, and developer analytics in a beautiful modern interface.`
      : description;

    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const updateMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      } else {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.split('"')[1]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.split('"')[1]);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', 'content', fullDescription);
    updateMetaTag('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'content', fullDescription);
    updateMetaTag('meta[property="og:image"]', 'content', `https://gitflexx.vercel.app${image}`);
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    
    // Update Twitter tags
    updateMetaTag('meta[property="twitter:title"]', 'content', fullTitle);
    updateMetaTag('meta[property="twitter:description"]', 'content', fullDescription);
    updateMetaTag('meta[property="twitter:image"]', 'content', `https://gitflexx.vercel.app${image}`);
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', fullUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', fullUrl);
      document.head.appendChild(canonical);
    }

    // Add JSON-LD structured data
    const removeExistingJSONLD = () => {
      const existing = document.querySelector('script[type="application/ld+json"]');
      if (existing) {
        existing.remove();
      }
    };

    removeExistingJSONLD();
    
    const jsonLD = document.createElement('script');
    jsonLD.type = 'application/ld+json';
    jsonLD.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "GitFlex",
      "description": description,
      "url": "https://gitflexx.vercel.app",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Person",
        "name": "Nishad Kindre",
        "url": "https://github.com/nishadkindre"
      },
      ...(username && {
        "mainEntity": {
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "name": username,
            "url": `https://github.com/${username}`
          }
        }
      })
    });
    document.head.appendChild(jsonLD);

    // Cleanup function to remove JSON-LD when component unmounts
    return () => {
      removeExistingJSONLD();
    };
  }, [title, description, image, url, username, noindex]);

  return null; // This component doesn't render anything
};

export default SEO;