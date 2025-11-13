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
