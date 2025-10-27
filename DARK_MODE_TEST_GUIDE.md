# Quick Dark Mode Test Guide

## How to Test Dark Mode Now

### Option 1: Browser DevTools (Instant Test)

Open browser console (F12) and paste this:

```javascript
// Switch to dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Switch back to light
document.documentElement.setAttribute('data-theme', 'light');
```

---

### Option 2: Find Theme Toggle in UI

Look for theme toggle button in:

- ✅ Navbar (usually top right)
- ✅ Settings page
- ✅ User menu dropdown

Click to cycle through: Light → Dark → System

---

## What to Check

### ✅ Landing Page Sections

1. **Hero Section**

   - Title text visible (light gray on dark blue)
   - Subtitle readable
   - Search box inputs clear

2. **Features Section**

   - Card backgrounds dark
   - Icon colors visible
   - Text readable

3. **How It Works**

   - Step numbers visible
   - Descriptions clear

4. **Testimonials**

   - Quote text readable
   - Author names visible
   - Cards have proper background

5. **Stats Section**

   - Numbers bright and clear
   - Labels readable

6. **CTA Section**
   - Title and description visible
   - Button colors proper

---

## Expected Dark Mode Colors

### Background Colors

- **Page Background**: Very dark blue-gray `#1A1D25`
- **Card Background**: Slightly lighter `#24272E`

### Text Colors

- **Primary Text**: Light gray `#EEF1F6` (very readable)
- **Secondary Text**: Medium gray `#9CA3AF`
- **Primary Blue**: Brighter `#2B9FDB` (LinkedIn blue adjusted)

### Interactive Elements

- **Buttons**: Blue `#2B9FDB` with white text
- **Links**: Blue that's visible on dark backgrounds
- **Borders**: Subtle gray `#3A3D45`

---

## Common Issues & Solutions

### Issue: Text still not visible

**Solution**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Theme toggle not working

**Solution**: Use DevTools method above to force theme switch

### Issue: Some sections still have white text on white

**Solution**: Check if you're using custom CSS that overrides variables

### Issue: Buttons invisible

**Solution**: Verify button uses CSS variables, not hardcoded colors

---

## Quick Visual Check

When in dark mode, you should see:

✅ **Hero Section**: Light text on dark gradient background
✅ **Search Box**: Dark inputs with light text
✅ **All Cards**: Dark backgrounds with light text
✅ **All Headings**: Light colored, highly visible
✅ **All Paragraphs**: Gray colored, readable
✅ **Buttons**: Blue with white text, visible hover states

❌ **Should NOT see**:

- White text on white background
- Black text on black background
- Invisible buttons
- Unreadable form inputs

---

## Test Contrast (Quick Eye Test)

### Good Contrast ✅

- You can read text effortlessly
- No eye strain after 30 seconds
- Clear distinction between elements
- Buttons stand out

### Bad Contrast ❌

- Squinting to read text
- Eye strain immediately
- Elements blend together
- Buttons hard to find

---

## Browser-Specific Notes

### Chrome/Edge

- DevTools: F12 → Console
- Perfect support for CSS variables

### Firefox

- DevTools: F12 → Console
- Perfect support for CSS variables

### Safari

- DevTools: Cmd+Option+C → Console
- May need page refresh after theme change

---

## Mobile Testing

### On Mobile Browser

1. Open browser settings/tools
2. Select "Desktop Site" (for easier testing)
3. Use same DevTools method
4. Or use theme toggle if available

### Expected on Mobile

- ✅ Same dark colors as desktop
- ✅ Text remains readable
- ✅ Touch targets still visible
- ✅ Forms still functional

---

## Automated Test Script

Copy-paste this in browser console to test all sections:

```javascript
// Dark mode test script
const testDarkMode = () => {
  console.log('🌙 Testing Dark Mode...');

  // Switch to dark
  document.documentElement.setAttribute('data-theme', 'dark');

  // Test sections
  const sections = [
    '.hero-section',
    '.features-section',
    '.how-it-works-section',
    '.testimonials-section',
    '.stats-section',
    '.cta-section',
  ];

  sections.forEach((selector) => {
    const section = document.querySelector(selector);
    if (section) {
      const styles = window.getComputedStyle(section);
      console.log(`✅ ${selector}:`);
      console.log(`   Background: ${styles.backgroundColor}`);
      console.log(`   Color: ${styles.color}`);
    } else {
      console.log(`⚠️  ${selector} not found`);
    }
  });

  console.log('✅ Dark mode test complete!');
};

testDarkMode();
```

---

## Revert to Light Mode

If dark mode has issues, quickly switch back:

```javascript
document.documentElement.setAttribute('data-theme', 'light');
```

Or refresh the page (F5) - it defaults to light mode.

---

## Report Issues

If you find text visibility issues:

1. Note the exact section (e.g., "Hero title")
2. Note the theme (dark/light)
3. Take a screenshot
4. Share browser console errors (if any)

Example report:

```
Section: Testimonials
Theme: Dark
Issue: Author names invisible (white text on light background)
Browser: Chrome 120
Screenshot: [attach]
```

---

## Status Indicators

When testing, look for these visual cues:

### ✅ Working Correctly

- High contrast between text and background
- No squinting needed
- Smooth transitions when switching themes
- All interactive elements visible

### ⚠️ Needs Attention

- Low contrast (hard to read)
- Flickering on theme change
- Some text invisible
- Buttons blend into background

### ❌ Not Working

- Complete sections invisible
- Theme toggle doesn't work
- Console errors present
- Page breaks on theme switch

---

## Next Steps After Testing

If everything looks good:

1. ✅ Test on different screen sizes
2. ✅ Test in different browsers
3. ✅ Test with system dark mode
4. ✅ Ready for production

If issues found:

1. Document specific problems
2. Note affected sections
3. Share findings for fixes
4. Test again after updates
