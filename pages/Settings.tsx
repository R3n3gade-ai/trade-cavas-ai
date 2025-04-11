import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { toast } from 'sonner';
import { useThemeStore } from '../utils/themeStore';

const Settings: React.FC = () => {
  const {
    backgroundColor,
    containerColor,
    textColor,
    setBackgroundColor,
    setContainerColor,
    setTextColor,
    applyTheme
  } = useThemeStore();

  const [bgColor, setBgColor] = useState(backgroundColor);
  const [containerBgColor, setContainerBgColor] = useState(containerColor);
  const [txtColor, setTxtColor] = useState(textColor);
  const [bgColorError, setBgColorError] = useState('');
  const [containerColorError, setContainerColorError] = useState('');
  const [txtColorError, setTxtColorError] = useState('');

  // Apply theme on component mount and when colors change
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Handle background color change
  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    setBackgroundColor(color);
    applyTheme();
  };

  // Handle container color change
  const handleContainerColorChange = (color: string) => {
    setContainerBgColor(color);
    setContainerColor(color);
    applyTheme();
  };

  // Handle text color change
  const handleTextColorChange = (color: string) => {
    setTxtColor(color);
    setTextColor(color);
    applyTheme();
  };

  // Validate colors
  const validateColors = () => {
    let isValid = true;

    // Reset errors
    setBgColorError('');
    setContainerColorError('');
    setTxtColorError('');

    // Check if background color is valid
    if (!isValidColor(bgColor)) {
      setBgColorError('Please enter a valid color (hex, rgb, or color name)');
      isValid = false;
    }

    // Check if container color is valid
    if (!isValidColor(containerBgColor)) {
      setContainerColorError('Please enter a valid color (hex, rgb, or color name)');
      isValid = false;
    }

    // Check if text color is valid
    if (!isValidColor(txtColor)) {
      setTxtColorError('Please enter a valid color (hex, rgb, or color name)');
      isValid = false;
    }

    // Check if background and text colors are too similar
    if (isValid && areColorsTooSimilar(bgColor, txtColor)) {
      setTxtColorError('Text color is too similar to background color');
      isValid = false;
    }

    // Check if container and text colors are too similar
    if (isValid && areColorsTooSimilar(containerBgColor, txtColor)) {
      setTxtColorError('Text color is too similar to container color');
      isValid = false;
    }

    return isValid;
  };

  // Check if a color is valid
  const isValidColor = (color: string) => {
    // Create a temporary element to test the color
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    return tempElement.style.color !== '';
  };

  // Check if colors are too similar (simplified version)
  const areColorsTooSimilar = (color1: string, color2: string) => {
    // Convert colors to RGB
    const tempElement1 = document.createElement('div');
    tempElement1.style.color = color1;
    document.body.appendChild(tempElement1);
    const rgb1 = window.getComputedStyle(tempElement1).color;
    document.body.removeChild(tempElement1);

    const tempElement2 = document.createElement('div');
    tempElement2.style.color = color2;
    document.body.appendChild(tempElement2);
    const rgb2 = window.getComputedStyle(tempElement2).color;
    document.body.removeChild(tempElement2);

    // Extract RGB values
    const rgbToArray = (rgb: string) => {
      const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (!match) return [0, 0, 0];
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    };

    const [r1, g1, b1] = rgbToArray(rgb1);
    const [r2, g2, b2] = rgbToArray(rgb2);

    // Calculate brightness difference
    const brightness1 = (r1 * 299 + g1 * 587 + b1 * 114) / 1000;
    const brightness2 = (r2 * 299 + g2 * 587 + b2 * 114) / 1000;
    const brightnessDifference = Math.abs(brightness1 - brightness2);

    // Calculate color difference
    const colorDifference = Math.max(
      Math.abs(r1 - r2),
      Math.abs(g1 - g2),
      Math.abs(b1 - b2)
    );

    // WCAG 2.0 recommendations for text visibility
    return brightnessDifference < 125 || colorDifference < 500;
  };

  // Save theme settings
  const saveThemeSettings = () => {
    if (validateColors()) {
      setBackgroundColor(bgColor);
      setContainerColor(containerBgColor);
      setTextColor(txtColor);
      applyTheme();
      toast.success('Theme settings saved successfully');
    }
  };

  // Apply dark theme
  const applyDarkTheme = () => {
    const darkBg = '#030822'; // Dark blue
    const darkContainer = '#0a1029'; // Slightly lighter dark blue
    const darkText = '#ffffff'; // White

    setBgColor(darkBg);
    setContainerBgColor(darkContainer);
    setTxtColor(darkText);
    setBackgroundColor(darkBg);
    setContainerColor(darkContainer);
    setTextColor(darkText);
    applyTheme();
    toast.success('Dark theme applied');
  };

  // Apply light theme
  const applyLightTheme = () => {
    const lightBg = '#f8f9fa'; // Light gray
    const lightContainer = '#ffffff'; // White
    const lightText = '#212529'; // Dark gray

    setBgColor(lightBg);
    setContainerBgColor(lightContainer);
    setTxtColor(lightText);
    setBackgroundColor(lightBg);
    setContainerColor(lightContainer);
    setTextColor(lightText);
    applyTheme();
    toast.success('Light theme applied');
  };

  return (
    <DashboardLayout title="Settings">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="bg-card border border-white/10 rounded-lg p-6 mb-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Appearance Settings</h2>
          <p className="text-muted-foreground mb-6">Customize the look and feel of the platform</p>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="space-x-2">
                <button
                  className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5"
                  onClick={applyLightTheme}
                >
                  Light
                </button>
                <button
                  className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5"
                  onClick={applyDarkTheme}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="bgColor" className="block text-sm font-medium">Background Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="bgColor"
                    type="text"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-md"
                  />
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-10 h-10 rounded border border-white/10 cursor-pointer"
                    title="Choose background color"
                  />
                </div>
                {bgColorError && <p className="text-red-500 text-sm">{bgColorError}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="containerColor" className="block text-sm font-medium">Container Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="containerColor"
                    type="text"
                    value={containerBgColor}
                    onChange={(e) => handleContainerColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-md"
                  />
                  <input
                    type="color"
                    value={containerBgColor}
                    onChange={(e) => handleContainerColorChange(e.target.value)}
                    className="w-10 h-10 rounded border border-white/10 cursor-pointer"
                    title="Choose container color"
                  />
                </div>
                {containerColorError && <p className="text-red-500 text-sm">{containerColorError}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="txtColor" className="block text-sm font-medium">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="txtColor"
                    type="text"
                    value={txtColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-md"
                  />
                  <input
                    type="color"
                    value={txtColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-10 h-10 rounded border border-white/10 cursor-pointer"
                    title="Choose text color"
                  />
                </div>
                {txtColorError && <p className="text-red-500 text-sm">{txtColorError}</p>}
              </div>

              <div className="pt-4">
                <button
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={saveThemeSettings}
                >
                  Save Theme Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-white/10 rounded-lg p-6 mb-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
          <p className="text-muted-foreground">Account settings will be implemented in a future update.</p>
        </div>

        <div className="bg-card border border-white/10 rounded-lg p-6 mb-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
          <p className="text-muted-foreground">Notification settings will be implemented in a future update.</p>
        </div>

        <div className="bg-card border border-white/10 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">API Key Management</h2>
          <p className="text-muted-foreground">API key management will be implemented in a future update.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
