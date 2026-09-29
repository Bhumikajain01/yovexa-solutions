import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, className = "w-5 h-5", size, color, fallback = null }) {
  if (!name || typeof name !== 'string') {
    if (fallback && Icons[fallback]) {
      const FallbackComponent = Icons[fallback];
      return <FallbackComponent className={className} size={size} color={color} />;
    }
    return null;
  }
  const IconComponent = Icons[name.trim()] || (fallback && Icons[fallback] ? Icons[fallback] : null);
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} color={color} />;
}
