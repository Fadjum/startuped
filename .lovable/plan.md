
## Remove Location Badge from Hero Section

This is a quick UI change to remove the location badge text from the home page hero section.

### What Will Change
- Remove the badge that says "Serving Entebbe & Surrounding Areas" with the map pin icon from the top of the hero section
- The headline "Find Rental Houses & Rooms in Entebbe" will become the first visible element in the hero

### File to Modify
- `src/pages/Index.tsx` - Delete lines 74-78 (the badge div element)

### Technical Details
The badge element to remove:
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-6">
  <MapPin className="w-4 h-4" />
  Serving Entebbe & Surrounding Areas
</div>
```

The `MapPin` import can also be removed from line 3 since it will no longer be used on this page.
