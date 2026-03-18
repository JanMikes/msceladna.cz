import type { ComponentMap } from '@/lib/types';

interface MapEmbedProps {
  data: ComponentMap;
}

export function MapEmbed({ data }: MapEmbedProps) {
  if (!data.embedUrl) return null;

  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{ height: data.height || 400 }}
    >
      <iframe
        src={data.embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa"
      />
    </div>
  );
}
