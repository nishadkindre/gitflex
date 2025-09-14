import React from 'react';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiC,
  SiRust,
  SiGo,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiDart,
  SiHtml5,
  SiCss3,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiNodedotjs,
  SiGithub,
  SiLinkedin,
  SiInstagram,
  SiX,
  SiFacebook,
  SiYoutube,
  SiTwitch,
  SiDiscord,
  SiTelegram,
  SiMedium,
  SiStackoverflow,
  SiCodepen
} from 'react-icons/si';
import { FaGlobe, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaJava } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';

// Programming Language Icons
export const getLanguageIcon = (language, size = 20) => {
  const iconProps = { size, className: 'inline-block' };

  const languageIcons = {
    JavaScript: () => <SiJavascript {...iconProps} className={`${iconProps.className} text-yellow-500`} />,
    TypeScript: () => <SiTypescript {...iconProps} className={`${iconProps.className} text-blue-500`} />,
    Python: () => <SiPython {...iconProps} className={`${iconProps.className} text-blue-600`} />,
    Java: () => <FaJava {...iconProps} className={`${iconProps.className} text-red-500`} />,
    'C++': () => <SiCplusplus {...iconProps} className={`${iconProps.className} text-blue-700`} />,
    C: () => <SiC {...iconProps} className={`${iconProps.className} text-blue-800`} />,
    Rust: () => <SiRust {...iconProps} className={`${iconProps.className} text-orange-700`} />,
    Go: () => <SiGo {...iconProps} className={`${iconProps.className} text-blue-400`} />,
    PHP: () => <SiPhp {...iconProps} className={`${iconProps.className} text-indigo-600`} />,
    Ruby: () => <SiRuby {...iconProps} className={`${iconProps.className} text-red-600`} />,
    Swift: () => <SiSwift {...iconProps} className={`${iconProps.className} text-orange-500`} />,
    Kotlin: () => <SiKotlin {...iconProps} className={`${iconProps.className} text-purple-500`} />,
    Dart: () => <SiDart {...iconProps} className={`${iconProps.className} text-blue-500`} />,
    HTML: () => <SiHtml5 {...iconProps} className={`${iconProps.className} text-orange-600`} />,
    CSS: () => <SiCss3 {...iconProps} className={`${iconProps.className} text-blue-500`} />,
    React: () => <SiReact {...iconProps} className={`${iconProps.className} text-cyan-400`} />,
    Vue: () => <SiVuedotjs {...iconProps} className={`${iconProps.className} text-green-500`} />,
    Angular: () => <SiAngular {...iconProps} className={`${iconProps.className} text-red-500`} />
  };

  const IconComponent = languageIcons[language];
  return IconComponent ? <IconComponent /> : <span className="text-gray-400">●</span>;
};

// Social Media Icons
export const getSocialIcon = (platform, size = 20) => {
  const iconProps = { size, className: 'inline-block' };

  const socialIcons = {
    twitter: () => <SiX {...iconProps} className={`${iconProps.className} text-gray-800 dark:text-white`} />,
    x: () => <SiX {...iconProps} className={`${iconProps.className} text-gray-800 dark:text-white`} />,
    linkedin: () => <SiLinkedin {...iconProps} className={`${iconProps.className} text-blue-600`} />,
    instagram: () => <SiInstagram {...iconProps} className={`${iconProps.className} text-pink-500`} />,
    facebook: () => <SiFacebook {...iconProps} className={`${iconProps.className} text-blue-600`} />,
    github: () => <SiGithub {...iconProps} className={`${iconProps.className} text-gray-700 dark:text-gray-300`} />,
    youtube: () => <SiYoutube {...iconProps} className={`${iconProps.className} text-red-500`} />,
    twitch: () => <SiTwitch {...iconProps} className={`${iconProps.className} text-purple-500`} />,
    discord: () => <SiDiscord {...iconProps} className={`${iconProps.className} text-indigo-500`} />,
    telegram: () => <SiTelegram {...iconProps} className={`${iconProps.className} text-blue-400`} />,
    medium: () => <SiMedium {...iconProps} className={`${iconProps.className} text-gray-800 dark:text-white`} />,
    stackoverflow: () => <SiStackoverflow {...iconProps} className={`${iconProps.className} text-orange-500`} />,
    codepen: () => <SiCodepen {...iconProps} className={`${iconProps.className} text-gray-800 dark:text-white`} />,
    website: () => <FaGlobe {...iconProps} className={`${iconProps.className} text-gray-600`} />,
    email: () => <FaEnvelope {...iconProps} className={`${iconProps.className} text-gray-600`} />
  };

  const IconComponent = socialIcons[platform.toLowerCase()];
  return IconComponent ? <IconComponent /> : <FaGlobe {...iconProps} className={`${iconProps.className} text-gray-600`} />;
};

// Utility function to detect platform from URL
export const detectSocialPlatform = url => {
  if (!url) return null;

  const platformPatterns = {
    twitter: /twitter\.com|x\.com/i,
    linkedin: /linkedin\.com/i,
    instagram: /instagram\.com/i,
    facebook: /facebook\.com/i,
    github: /github\.com/i,
    gitlab: /gitlab\.com/i,
    youtube: /youtube\.com/i,
    twitch: /twitch\.tv/i,
    discord: /discord\.(gg|com)/i,
    telegram: /t\.me|telegram\.org/i,
    whatsapp: /wa\.me|whatsapp\.com/i,
    medium: /medium\.com/i,
    'dev.to': /dev\.to/i,
    hashnode: /hashnode\.(com|dev)/i,
    stackoverflow: /stackoverflow\.com/i,
    codepen: /codepen\.io/i,
    dribbble: /dribbble\.com/i,
    behance: /behance\.net/i
  };

  for (const [platform, pattern] of Object.entries(platformPatterns)) {
    if (pattern.test(url)) return platform;
  }

  return 'website';
};

// External link icon
export const ExternalLinkIcon = ({ size = 16, className = '' }) => <HiExternalLink size={size} className={`inline-block ${className}`} />;

// Location and date icons
export const LocationIcon = ({ size = 16, className = '' }) => <FaMapMarkerAlt size={size} className={`inline-block ${className}`} />;

export const CalendarIcon = ({ size = 16, className = '' }) => <FaCalendarAlt size={size} className={`inline-block ${className}`} />;

export default {
  getLanguageIcon,
  getSocialIcon,
  detectSocialPlatform,
  ExternalLinkIcon,
  LocationIcon,
  CalendarIcon
};
