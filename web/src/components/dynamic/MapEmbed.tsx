import type { ComponentMap } from '@/lib/types';
import { resolveMapEmbedUrl } from '@/lib/maps';

interface MapEmbedProps {
  data: ComponentMap;
}

export async function MapEmbed({ data }: MapEmbedProps) {
  if (!data.url) return null;

  const embedUrl = await resolveMapEmbedUrl(data.url);
  if (!embedUrl) return null;

  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{ height: data.height || 400 }}
    >
      <iframe
        src={embedUrl}
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
