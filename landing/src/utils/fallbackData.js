// Utility helpers for workshop and media display (No dummy/hardcoded data)

export const defaultWorkshopImages = {
  drone: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
  hydroponics: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop",
  mushroom: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=800&auto=format&fit=crop",
  beekeeping: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=800&auto=format&fit=crop",
  biofloc: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop",
  saffron: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop",
  precision: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop",
};

export const getWorkshopThumbnail = (w = {}) => {
  if (w.coverImage && w.coverImage.trim()) {
    return w.coverImage;
  }
  const text = `${w.title || ""} ${w.category || ""}`.toLowerCase();
  for (const [key, url] of Object.entries(defaultWorkshopImages)) {
    if (text.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1592417817098-8f3d69102553?q=80&w=800&auto=format&fit=crop";
};
