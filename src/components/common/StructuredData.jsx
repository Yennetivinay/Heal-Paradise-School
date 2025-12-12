import { useEffect } from 'react';

const StructuredData = () => {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Heal Paradise School",
      "alternateName": "Heal Paradise",
      "url": "https://healparadiseschool.edu",
      "logo": "https://healparadiseschool.edu/logo.png",
      "description": "A compassionate, world-class CBSE school dedicated to uplifting under-privileged children, single-parent families, and orphans — providing full scholarship and residential care.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3-118, Thotapalli Village, Agiripalli Madalam",
        "addressLocality": "Eluru District",
        "postalCode": "521211",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "Admissions",
        "email": "admissions@healparadiseschool.edu"
      },
      "sameAs": [
        "https://www.facebook.com/HealVillage"
      ],
      "educationalCredentialAwarded": "CBSE",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Educational Programs",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Course",
              "name": "CBSE Curriculum",
              "description": "Complete CBSE curriculum with 100% scholarship for eligible students"
            }
          }
        ]
      }
    };

    // School Schema
    const schoolSchema = {
      "@context": "https://schema.org",
      "@type": "School",
      "name": "Heal Paradise School",
      "description": "CBSE Affiliated Residential School providing 100% scholarship to under-privileged children, single-parent families, and orphans.",
      "url": "https://healparadiseschool.edu",
      "logo": "https://healparadiseschool.edu/logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3-118, Thotapalli Village, Agiripalli Madalam",
        "addressLocality": "Eluru District",
        "postalCode": "521211",
        "addressCountry": "IN"
      },
      "telephone": "+91-XXXXXXXXXX",
      "email": "info@healparadiseschool.edu",
      "foundingDate": "2024",
      "award": "100% Scholarship Program"
    };

    // WebSite Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Heal Paradise School",
      "url": "https://healparadiseschool.edu",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://healparadiseschool.edu/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };

    // Add schemas to page
    const addSchema = (schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = `schema-${schema['@type'].toLowerCase().replace(/\s+/g, '-')}`;
      document.head.appendChild(script);
    };

    // Remove existing schemas if any
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => {
      if (schema.id && schema.id.startsWith('schema-')) {
        schema.remove();
      }
    });

    // Add all schemas
    addSchema(organizationSchema);
    addSchema(schoolSchema);
    addSchema(websiteSchema);

    // Cleanup function
    return () => {
      const schemas = document.querySelectorAll('script[id^="schema-"]');
      schemas.forEach(schema => schema.remove());
    };
  }, []);

  return null;
};

export default StructuredData;


