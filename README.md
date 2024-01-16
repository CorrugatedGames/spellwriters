# Spellwriters

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.10.

## Getting Started

### Prerequisites

- Node 18.15+

### Installation

1. Clone the repo
1. `npm i`
1. `npm run gamedata`

## Development

### Running Code

1. `npm start`

### Creating Content

1. Go to `http://localhost:9104/debug/components` to view all possible components in the game based on the current set of content

### Creating a New Page

1. Run the following:

```bash
npx ng g m pages/PageName --routing
npx ng g c pages/PageName
```

1. Add `SharedModule` to the page imports.
1. Add a page route to `app-routing.module.ts`:

```typescript
{
  path: 'page-name',
  loadChildren: () => import('./pages/page-name/page-name.module').then(m => m.PageNameModule)
}
```

1. Add a default route to the pages router module:

```typescript
{
  path: '',
  component: PageNameComponent
}
```

## Building

1. `npm run build:all`
