# 🚜 Fala Farmer App - Copilot Instructions

## 📋 Table of Contents

- [Project Context](#-project-context)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Internationalization (Kannada/English)](#-internationalization-kannadaenglish)
- [Mobile & PWA Rules](#-mobile--pwa-rules)
- [Farmer UX Patterns](#-farmer-ux-patterns)
- [Code Quality Standards](#-code-quality-standards)
- [Component Patterns](#-component-patterns)
- [Performance & Optimization](#-performance--optimization)
- [Quick Reference](#-quick-reference)
- [Common Mistakes to Avoid](#-common-mistakes-to-avoid)

---

## 🎯 Project Context

This is a **NextJS PWA** for farmers to manage their agricultural operations in Karnataka, India. The app helps farmers with:

- **Inventory Management**: Update and track harvested crops and quantities
- **Order Management**: View and fulfill customer orders
- **Earnings Tracking**: Monitor income and weekly earnings in Number and Graph formats
- **Task Management**: Complete agricultural tasks with validation by capturing photos

**Target Users**: Farmers in Karnataka who primarily speak Kannada. Later we can add Hindi, Tamil, and Telugu.
**Business Model**: Agritech supply chain connecting farmers directly with premium customers
**Key Goal**: Quick MVP for validation, lean and minimal approach

---

## 🛠 Tech Stack & Architecture

### Core Technologies

- **NextJS 15** with App Router
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** for styling
- **Shadcn UI** components for consistent design
- **MongoDB** for database management
- **React Hook Form** with **Zod** for form validation
- **TanStack React Query** for data fetching
- **Next.js Image** component for image optimization
- **React Context** for global state management
- **next-intl** for internationalization
- **useTranslations** hook from **next-intl** for internationalization
- **PWA** capabilities with offline support

### Architecture Principles

- Mobile-first responsive design
- Offline-first data handling
- Progressive enhancement patterns
- Component-based architecture
- Type-safe development

---

## 🌐 Internationalization (Kannada/English)

### Language Requirements

- **Default language**: Kannada (kn)
- **Secondary language**: English (en)
- **All user-facing text must be externalized** to translation files
- **Never hardcode text strings** in components
- Kannada user experience takes priority over English

### Translation Patterns

```typescript
// ✅ Correct approach
const t = useTranslations('inventory');
<button>{t('actions.add')}</button>

// ❌ Wrong approach
<button>Add Item</button>
```

### Translation Key Structure

- Use semantic keys: `t('inventory.addCrop')` not `t('Add Crop')`
- Include context: `buttons.save`, `messages.success`, `errors.network`
- Nested structure: `inventory.actions.add`, `orders.status.pending`
- Feature-based grouping: `tasks.irrigation.title`

### File Structure

```
/public/locales/
  /kn/
    common.json
    inventory.json
    orders.json
    earnings.json
    tasks.json
  /en/
    [same structure]
```

### Kannada-Specific Considerations

- Design components to handle **20-40% longer text** in Kannada
- use **English Numbders** in Kannada context (e.g., 1, 2, 3)
- Handle **mixed content** (Kannada + English technical terms)
- Support **Kannada Unicode** properly
- Consider **currency formatting**: ₹ symbol placement
- **Date formats**: DD/MM/YYYY with localized month names

### Form Validation & Messages

- All validation messages must be translated
- Use Zod with custom error messages in both languages
- Handle number and currency formatting differences
- Include context comments for translators

---

## 📱 Mobile & PWA Rules

### Mobile-First Development

- Always write **mobile-first responsive code**
- Use **large touch targets** (minimum 44px × 44px)
- Ensure **high contrast** for outdoor visibility
- Test on **basic Android browsers**
- Optimize for **slow network conditions**

### PWA Requirements

- Include proper **meta tags** for PWA in all pages
<!-- - Implement **service worker patterns** for offline functionality -->
- Use **localStorage** for offline data persistence
- Add proper **manifest.json** configurations
- Include **install prompts** and **offline indicators**
- Show **loading states** for all async operations

### Accessibility Standards

- Add proper **ARIA labels** and **semantic HTML**
- Use **clear visual hierarchy**
<!-- - Ensure **keyboard navigation** works
- Test with **screen readers** -->
- Maintain **focus management**

---

## 👨‍🌾 Farmer UX Patterns

### User Experience Principles

- Use **simple, clear language** in UI text
- **Minimize text input** - prefer Icons, dropdowns, buttons, image uploads
- Show **clear feedback** for all user actions
- Implement **error recovery** patterns
- Use **familiar agricultural terminology**

### Data Input Patterns

- **Image uploads** for crop photos and task validation
- **Dropdown selections** over free text input
- **Date pickers** for harvest dates and schedules
- **Quantity inputs** with clear units (kg, tons, etc.)
- **Touch-friendly** form controls

### Information Display

- **Visual indicators** for order status, task completion
- **Clear earnings summaries** with rupee formatting
- **Simple charts** for earnings tracking
- **Photo galleries** for crop documentation
- **Step-by-step** task instructions

---

## 🔧 Code Quality Standards

### TypeScript Usage

- Always use **TypeScript with strict mode**
- Define **proper interfaces** for all props and data structures
- Use **type guards** for runtime type checking
- Implement **error boundaries** and comprehensive error handling
- **No any types** - use proper typing

### Component Standards

- Create **reusable components** for common farmer actions
- Use **React Hook Form** for all form management
- Implement **React.memo** for expensive components
- Add **loading and error states** to all data fetching
- Follow **single responsibility principle**

### Data Management

- Always **validate data** with Zod schemas
- Implement **optimistic updates** for better UX
- Use **SWR or TanStack Query** for data fetching
- Store **sensitive data securely** (no plaintext storage)
- Handle **network failures gracefully**

---

## 🏗 Component Patterns

### Directory Structure

```
/components
  /farmer
    /inventory
      InventoryCard.tsx
      InventoryForm.tsx
      InventoryList.tsx
    /orders
      OrderCard.tsx
      OrderStatus.tsx
      OrderDetails.tsx
    /earnings
      EarningsChart.tsx
      EarningSummary.tsx
    /tasks
      TaskCard.tsx
      TaskForm.tsx
      TaskValidation.tsx
  /ui
    Button.tsx
    Input.tsx
    Modal.tsx
```

### Naming Conventions

- **PascalCase** for components: `FarmerInventoryCard`
- **camelCase** for functions and variables
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file names: `farmer-inventory-card.tsx`

### Component Template

```typescript
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ComponentProps {
  // Define all props with proper types
}

export const ComponentName: FC<ComponentProps> = ({ prop1, prop2 }) => {
  const t = useTranslations("feature");

  return (
    <div className='mobile-first-classes'>
      <h2>{t("title")}</h2>
      {/* Component content */}
    </div>
  );
};
```

---

## ⚡ Performance & Optimization

### Image Optimization

- Use **WebP format** with fallbacks
- Implement **lazy loading** for images
- **Compress images** for mobile networks
- Use **Next.js Image** component
- **Responsive images** with proper srcSet

### Code Optimization

- Implement **code splitting** for route-based chunks
- **Minimize bundle size** - prefer native browser APIs
- Use **React.memo** and **useMemo** appropriately
- Add proper **caching strategies**
- **Tree-shake** unused dependencies

### Network Optimization

- **Offline-first** approach for critical features
- **Progressive data loading**
- **Request deduplication**
- **Proper error retry** mechanisms
- **Background sync** for offline actions

---

## 📝 Quick Reference

### Translation Pattern

```typescript
// ✅ Correct
{
  t("inventory.addCrop");
}
{
  t("buttons.save");
}
{
  t("messages.success");
}

// ❌ Wrong
("Add Crop");
("Save");
("Success!");
```

### Touch Targets

```css
/* ✅ Correct - Minimum 44px */
.btn { min-h-[44px] min-w-[44px] }

/* ❌ Wrong - Too small */
.btn { h-8 w-8 }
```

### Currency Formatting

```typescript
// ✅ Correct
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

// ❌ Wrong
`₹${amount}`;
```

### Loading States

```typescript
// ✅ Always include loading states
{
  isLoading ? <div>{t("common.loading")}</div> : <DataComponent data={data} />;
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This

- Hardcode English text in components
- Use small touch targets (< 44px)
- Skip loading states on async operations
- Store sensitive data in localStorage without encryption
- Use `any` type in TypeScript
- Ignore offline scenarios
- Create components without proper error boundaries
- Skip image optimization
- Use complex forms without proper validation
- Forget to test with real Kannada text

### ✅ Always Do This

- Extract all text to translation files
- Use large, touch-friendly buttons
- Show loading and error states
- Implement proper error handling
- Use strict TypeScript typing
- Design for offline-first scenarios
- Add proper error boundaries
- Optimize images for mobile
- Use React Hook Form with Zod validation
- Test with actual Kannada agricultural terminology

---

## 🌱 Agricultural Context

### Common Terminology

- **Crops**: Spinach (ಪಾಲಕ್), Coriander (ಕೊತ್ತಂಬರಿ), Mint (ಪುದೀನ)
- **Units**: Kilograms (ಕಿಲೋಗ್ರಾಂ), Tons (ಟನ್), Bundles (ಕಟ್ಟುಗಳು)
- **Seasons**: Kharif, Rabi, Summer (refer to local seasonal patterns)
- **Quality Terms**: Fresh (ತಾಜಾ), Premium (ಪ್ರೀಮಿಯಂ), Grade A (ಗ್ರೇಡ್ ಎ)

### Business Flow Context

- Farmers → FPOs → Fala → Premium Customers
- Focus on quality over quantity
- Transparency in pricing and processes
- Direct farmer empowerment model

Remember: This app should feel natural to Karnataka farmers while being technically robust for scaling.

### Code Response Rules.

1. Generated code and explaination should be Consice and Straight Forward without verbose this. Just give me what I asked for.
2. Don't generate kannada text in code snippets, only use English for code. Generate kannada text only in translation files.
