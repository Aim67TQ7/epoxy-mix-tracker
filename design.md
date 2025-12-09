# Design System Documentation

This document defines the standard design patterns, styles, and sizing conventions for kiosk-style applications with accessibility-first design.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography & Sizing](#typography--sizing)
4. [Spacing](#spacing)
5. [Components](#components)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Form Patterns](#form-patterns)
8. [Modal Patterns](#modal-patterns)

---

## Design Philosophy

- **Accessibility First**: Designed for users with visual impairments
- **High Contrast**: Clear visual distinction between elements
- **Large Touch Targets**: Minimum 48px touch targets for kiosk use
- **Minimal Cognitive Load**: Simple, clear interfaces with obvious actions
- **Consistent Feedback**: Clear visual feedback for all interactions

---

## Color System

All colors are defined in HSL format in `src/index.css`. Never use direct colors in components.

### Semantic Tokens

```css
/* Light Mode */
--background: 0 0% 100%;           /* White background */
--foreground: 222.2 84% 4.9%;      /* Near-black text */
--primary: 222.2 47.4% 11.2%;      /* Dark blue primary */
--primary-foreground: 210 40% 98%; /* Light text on primary */
--secondary: 210 40% 96.1%;        /* Light gray secondary */
--muted: 210 40% 96.1%;            /* Muted backgrounds */
--muted-foreground: 215.4 16.3% 46.9%; /* Muted text */
--destructive: 0 84.2% 60.2%;      /* Red for errors/warnings */
--border: 214.3 31.8% 91.4%;       /* Light border */
--ring: 222.2 84% 4.9%;            /* Focus ring */
--radius: 0.5rem;                  /* Border radius */

/* Dark Mode */
--background: 222.2 84% 4.9%;      /* Dark background */
--foreground: 210 40% 98%;         /* Light text */
/* ... (see index.css for full dark mode tokens) */
```

### Status Colors

| Status | Tailwind Class | Use Case |
|--------|----------------|----------|
| Success | `bg-green-500`, `text-green-700` | Valid states, confirmations |
| Warning | `bg-amber-500`, `border-amber-500` | Attention needed, highlighted inputs |
| Error | `bg-red-500`, `bg-destructive` | Invalid states, out of range |
| Info | `bg-blue-500` | Informational messages |

### Visual Distinction Pattern

For critical input fields that need user attention:
```tsx
className="border-4 border-amber-500"
```

---

## Typography & Sizing

### Font Scale (Accessibility-Enhanced)

| Element | Tailwind Class | Size | Use Case |
|---------|----------------|------|----------|
| Page Title | `text-6xl` | 60px | Main headings |
| Section Title | `text-5xl` | 48px | Section headers |
| Input Text | `text-5xl` | 48px | Form input values |
| Labels | `text-4xl` | 36px | Input labels |
| Buttons | `text-4xl` to `text-5xl` | 36-48px | Action buttons |
| Helper Text | `text-2xl` | 24px | Secondary information |
| Small Text | `text-xl` | 20px | Tertiary information |

### Font Weights

| Weight | Class | Use Case |
|--------|-------|----------|
| Normal | `font-normal` | Body text |
| Medium | `font-medium` | Labels, emphasis |
| Semibold | `font-semibold` | Important labels |
| Bold | `font-bold` | Headings, critical info |

---

## Spacing

### Standard Spacing Scale

| Size | Tailwind | Pixels | Use Case |
|------|----------|--------|----------|
| xs | `p-2`, `gap-2` | 8px | Tight spacing |
| sm | `p-4`, `gap-4` | 16px | Component internal |
| md | `p-6`, `gap-6` | 24px | Section spacing |
| lg | `p-8`, `gap-8` | 32px | Major sections |
| xl | `p-12`, `gap-12` | 48px | Page sections |

### Container Pattern

```tsx
<div className="min-h-screen bg-background p-8">
  <div className="max-w-4xl mx-auto space-y-8">
    {/* Content */}
  </div>
</div>
```

---

## Components

### Buttons

#### Primary Action Button
```tsx
<Button 
  className="h-24 text-4xl font-bold px-12"
  size="lg"
>
  Submit
</Button>
```

#### Toggle Button Pattern
```tsx
<Button
  variant={isActive ? "default" : "outline"}
  className={cn(
    "h-20 text-3xl font-semibold flex-1",
    isActive && "bg-green-600 hover:bg-green-700"
  )}
>
  Option
</Button>
```

#### Icon Button
```tsx
<Button variant="ghost" size="icon" className="h-12 w-12">
  <Icon className="h-8 w-8" />
</Button>
```

### Input Fields

#### Large Accessible Input
```tsx
<Input
  className="h-20 text-5xl text-center border-4 border-amber-500"
  placeholder="0000"
/>
```

#### Standard Input
```tsx
<Input
  className="h-16 text-3xl"
/>
```

### Labels

```tsx
<Label className="text-4xl font-semibold">
  Field Label
</Label>
```

### Cards

```tsx
<Card className="p-6 space-y-6">
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

---

## Accessibility Requirements

### Minimum Requirements

1. **Touch Targets**: Minimum 48px height for all interactive elements
2. **Text Size**: Minimum 20px for any readable text
3. **Contrast**: Maintain WCAG AA contrast ratios (4.5:1 for text)
4. **Visual Feedback**: Clear hover/focus/active states
5. **Color Independence**: Don't rely solely on color to convey information

### Input Field Pattern for Vision Impairment

```tsx
<div className="space-y-2">
  <Label className="text-4xl font-semibold">
    Field Name
  </Label>
  <Input
    className="h-20 text-5xl text-center border-4 border-amber-500 font-bold"
    inputMode="numeric"
  />
</div>
```

### Feedback States

```tsx
// Success State
className="bg-green-100 border-green-500 text-green-700"

// Error State  
className="bg-red-100 border-red-500 text-red-700"

// Warning State
className="bg-amber-100 border-amber-500 text-amber-700"

// Disabled State
className="opacity-50 cursor-not-allowed"
```

---

## Form Patterns

### Form Layout

```tsx
<form className="space-y-8">
  {/* Input Groups */}
  <div className="grid grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label>Field 1</Label>
      <Input />
    </div>
    <div className="space-y-2">
      <Label>Field 2</Label>
      <Input />
    </div>
  </div>
  
  {/* Actions */}
  <div className="flex gap-4">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

### Toggle Group Pattern

```tsx
<div className="flex gap-4">
  {options.map((option) => (
    <Button
      key={option.value}
      variant={selected === option.value ? "default" : "outline"}
      onClick={() => setSelected(option.value)}
      className={cn(
        "h-20 text-3xl font-semibold flex-1",
        selected === option.value && "bg-green-600"
      )}
    >
      {option.label}
    </Button>
  ))}
</div>
```

### Validation Feedback

```tsx
// In-range value
<div className="text-6xl font-bold text-green-600">
  12.120
</div>

// Out-of-range value
<div className="bg-red-500 text-white p-6 text-center">
  <div className="text-4xl font-bold">OUT OF RANGE</div>
  <div className="text-2xl">Contact Supervisor</div>
</div>
```

---

## Modal Patterns

### Standard Modal

```tsx
<Dialog>
  <DialogContent className="max-w-4xl max-h-[90vh]">
    <DialogHeader>
      <DialogTitle className="text-3xl font-bold">
        Modal Title
      </DialogTitle>
    </DialogHeader>
    
    <ScrollArea className="h-[60vh]">
      {/* Content */}
    </ScrollArea>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tabs in Modal

```tsx
<Tabs defaultValue="tab1">
  <TabsList className="grid grid-cols-2 h-14">
    <TabsTrigger value="tab1" className="text-xl">
      Tab 1
    </TabsTrigger>
    <TabsTrigger value="tab2" className="text-xl">
      Tab 2
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    {/* Tab 1 Content */}
  </TabsContent>
  
  <TabsContent value="tab2">
    {/* Tab 2 Content */}
  </TabsContent>
</Tabs>
```

---

## File Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   ├── forms/        # Form-specific components
│   └── modals/       # Modal components
├── hooks/            # Custom React hooks
├── lib/
│   └── utils.ts      # Utility functions (cn helper)
├── pages/            # Page components
├── index.css         # Design tokens & global styles
└── App.tsx           # Main app component

tailwind.config.ts    # Tailwind configuration
```

---

## Quick Reference

### Essential Classes

```tsx
// Large accessible button
"h-24 text-4xl font-bold px-12"

// Large accessible input
"h-20 text-5xl text-center border-4 border-amber-500"

// Large label
"text-4xl font-semibold"

// Card with spacing
"p-6 space-y-6"

// Flex container with gap
"flex gap-4"

// Grid layout
"grid grid-cols-2 gap-6"

// Centered container
"max-w-4xl mx-auto"

// Full height page
"min-h-screen bg-background"
```

### Color Usage

```tsx
// Use semantic tokens, not direct colors
✅ "bg-background text-foreground"
✅ "bg-primary text-primary-foreground"
✅ "bg-destructive text-destructive-foreground"

// Only use direct colors for status indicators
✅ "bg-green-600" (success)
✅ "border-amber-500" (warning/attention)
✅ "bg-red-500" (error)

// Never use arbitrary colors
❌ "bg-[#1a2b3c]"
❌ "text-[rgb(100,100,100)]"
```
