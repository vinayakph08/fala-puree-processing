# Dashboard Components

This directory contains all the dashboard-related components for the Fala Admin Dashboard.

## Components

### 1. KeyMetricsCards

Displays key performance indicators in card format:

- Total Farmers
- Total Land Sown (in Guntas)
- Total Available Inventory (in kg)
- Current Available Inventory (in kg)

**Usage:**

```tsx
import { KeyMetricsCards } from "@/app/(protected)/dashboard/components";

<KeyMetricsCards
  metrics={{
    totalFarmers: 125,
    totalLandSown: 2450,
    totalInventory: 8500,
    currentInventory: 3200,
  }}
/>;
```

### 2. Dashboard Charts

#### FarmerGrowthChart

Line chart showing farmer registration growth over time.

**Usage:**

```tsx
import { FarmerGrowthChart } from "@/app/(protected)/dashboard/components";

<FarmerGrowthChart
  data={[
    { month: "Jan", farmers: 65 },
    { month: "Feb", farmers: 72 },
    // ...
  ]}
/>;
```

#### InventoryUsageChart

Pie chart showing inventory distribution by crop type.

**Usage:**

```tsx
import { InventoryUsageChart } from "@/app/(protected)/dashboard/components";

<InventoryUsageChart
  data={[
    { name: "Spinach", value: 35, color: "#22c55e" },
    { name: "Coriander", value: 25, color: "#3b82f6" },
    // ...
  ]}
/>;
```

#### InventoryGrowthChart

Bar chart showing inventory growth over time.

**Usage:**

```tsx
import { InventoryGrowthChart } from "@/app/(protected)/dashboard/components";

<InventoryGrowthChart
  data={[
    { month: "Jan", inventory: 4500 },
    { month: "Feb", inventory: 5200 },
    // ...
  ]}
/>;
```

## Layout

The dashboard components are arranged in a responsive grid:

- Key metrics cards at the top (4 columns on desktop, 2 on tablet, 1 on mobile)
- Charts in a 2x2 grid on desktop, stacked on mobile
- Farmer Growth Chart spans 2 columns
- Inventory Usage Chart in 1 column
- Inventory Growth Chart spans full width

## Data Types

All components use TypeScript interfaces defined in `./types.ts`:

- `DashboardMetrics`
- `FarmerGrowthData`
- `InventoryUsageData`
- `InventoryGrowthData`

## Dependencies

- `recharts` - for chart components
- `lucide-react` - for icons
- `@/components/ui/*` - for UI components (cards, etc.)

## Mock Data

All components include default mock data for development and testing purposes. In production, pass real data through props to override the mock data.
