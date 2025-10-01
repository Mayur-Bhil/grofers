export const validUrl = (name) => {
  // Handle empty or whitespace-only input
  if (!name || !name.toString().trim()) return '';
  
  const url = name
    .toString()
    .toLowerCase()                    // Convert to lowercase for consistency
    .trim()                          // Remove leading/trailing spaces
    .replaceAll(" ", "-")            // Replace spaces with hyphens
    .replaceAll(",", "-")            // Replace commas with hyphens
    .replaceAll("&", "-")            // Replace ampersands with hyphens
    .replace(/[^\w-]/g, '-')         // Replace any other special characters with hyphens
    .replace(/-+/g, '-')             // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, '');        // Remove leading/trailing hyphens
    
  return url;
};

// Test cases to verify the validation:
/*
validUrl("Hello World & Co.")        → "hello-world-co"
validUrl("ki - or --- or")           → "ki-or-or"
validUrl("  ")                       → ""
validUrl("")                         → ""
validUrl("---test---")               → "test"
validUrl("multiple,,,,commas")       → "multiple-commas"
validUrl("spaces   &   symbols!")    → "spaces-symbols"
*/