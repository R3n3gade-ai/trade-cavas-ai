import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  backgroundColor: string;
  containerColor: string;
  textColor: string;
  setBackgroundColor: (color: string) => void;
  setContainerColor: (color: string) => void;
  setTextColor: (color: string) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>(
  persist(
    (set, get) => ({
      backgroundColor: '#030822', // Dark blue (default)
      containerColor: '#0a1029', // Slightly lighter dark blue (default)
      textColor: '#ffffff', // White (default)

      setBackgroundColor: (color: string) => {
        set({ backgroundColor: color });
      },

      setContainerColor: (color: string) => {
        set({ containerColor: color });
      },

      setTextColor: (color: string) => {
        set({ textColor: color });
      },

      applyTheme: () => {
        const { backgroundColor, containerColor, textColor } = get();

        // Apply to document body
        document.body.style.backgroundColor = backgroundColor;
        document.body.style.color = textColor;

        // Apply to root element for CSS variables
        document.documentElement.style.setProperty('--background-color', backgroundColor);
        document.documentElement.style.setProperty('--container-color', containerColor);
        document.documentElement.style.setProperty('--text-color', textColor);

        // Create and apply a style element for global styles
        let styleEl = document.getElementById('theme-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'theme-styles';
          document.head.appendChild(styleEl);
        }

        // Update the style element with new theme
        styleEl.textContent = `
          :root {
            --background-color: ${backgroundColor};
            --container-color: ${containerColor};
            --text-color: ${textColor};
            --primary-color: #3b82f6;
          }

          body {
            background-color: ${backgroundColor};
            color: ${textColor};
          }

          /* Main content area */
          .main-content {
            background-color: ${backgroundColor};
          }

          /* Header */
          header, nav, .header {
            background-color: ${backgroundColor};
          }

          /* Override background for card elements */
          .bg-card, .card, [class*="bg-card"] {
            background-color: ${containerColor};
          }

          /* Dashboard layout */
          .dashboard-content {
            background-color: ${backgroundColor};
          }

          /* Sidebar */
          aside, .sidebar {
            background-color: ${containerColor};
          }

          /* Override text for muted elements */
          .text-muted-foreground {
            color: ${adjustColor(textColor, -30)};
          }
        `;
      }
    }),
    {
      name: 'theme-store',
    }
  )
);

// Helper function to lighten or darken a color
function adjustColor(color: string, amount: number): string {
  // For simplicity, we'll just adjust the background slightly
  // In a real implementation, you'd want a more robust color manipulation

  // Convert color to RGB if it's a named color or hex
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  document.body.appendChild(tempElement);
  const rgbColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);

  // Extract RGB values
  const rgbMatch = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch) return color;

  const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1]) + amount));
  const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2]) + amount));
  const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3]) + amount));

  return `rgb(${r}, ${g}, ${b})`;
}
