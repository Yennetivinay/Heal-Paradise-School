import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ title, description, image, url }) => {
  const location = useLocation();
  const baseUrl = 'https://healparadiseschool.edu';
  const currentUrl = `${baseUrl}${location.pathname}`;
  
  const defaultTitle = 'Heal Paradise School - CBSE Affiliated Residential School | 100% Scholarship';
  const defaultDescription = 'Heal Paradise School is a compassionate, world-class CBSE school dedicated to uplifting under-privileged children, single-parent families, and orphans — providing full scholarship and residential care.';
  const defaultImage = `${baseUrl}/logo.png`;

  useEffect(() => {
    // Update title
    document.title = title || defaultTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update description
    updateMetaTag('description', description || defaultDescription);
    updateMetaTag('og:description', description || defaultDescription, true);
    updateMetaTag('twitter:description', description || defaultDescription);

    // Update title
    updateMetaTag('og:title', title || defaultTitle, true);
    updateMetaTag('twitter:title', title || defaultTitle);

    // Update URL
    updateMetaTag('og:url', url || currentUrl, true);
    updateMetaTag('twitter:url', url || currentUrl);

    // Update image
    const imageUrl = image || defaultImage;
    updateMetaTag('og:image', imageUrl, true);
    updateMetaTag('twitter:image', imageUrl);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || currentUrl);
  }, [title, description, image, url, currentUrl]);

  return null;
};

export default SEOHead;


