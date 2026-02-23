# 🎨 Art Institute Explorer  
> Modern React + TypeScript art collection explorer with REST-API integration, Zod validation & persistent favourites  
> *(React · Vite · TypeScript · TailwindCSS · Zod · AIC API)*

<p align="center">
  <img alt="React" title="React" height="40" style="margin:0 20px;"
       src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" />
  <img alt="TypeScript" title="TypeScript" height="40" style="margin:0 20px;"
       src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" />
  <img alt="Vite" title="Vite" height="40" style="margin:0 20px;"
       src="https://raw.githubusercontent.com/github/explore/main/topics/vite/vite.png" />
  <img alt="Tailwind CSS" title="Tailwind CSS" height="40" style="margin:0 20px;"
       src="https://raw.githubusercontent.com/github/explore/main/topics/tailwind/tailwind.png" />
  <img alt="Zod" title="Zod" height="40" style="margin:0 20px;"
       src="https://raw.githubusercontent.com/colinhacks/zod/master/logo.svg" />
</p>

<p align="center">
  <sub>React · TypeScript · Zod · REST API · TailwindCSS · Vite</sub>
</p>

---

## 📖 Overview

**Art Institute Explorer** is a responsive frontend application that allows users to search the **Art Institute of Chicago** collection via the public API.

The project demonstrates clean architectural separation between:

- 🔎 API Layer  
- 🛡 Runtime Validation Layer  
- 🧠 Type-safe State Layer  
- 💾 Persistent Storage Layer  
- 🎨 Presentation Layer  

Users can browse artworks, save favourites to a personal gallery, and attach notes to each piece.

---

## 🖼 UI Preview

<table>
  <tr>
    <td><b>🔎 Search</b><br/><i>Landing hero preview + results grid</i></td>
    <td><b>🖼 Gallery</b><br/><i>Saved artworks + personal notes</i></td>
  </tr>
  <tr>
    <td>
      <img alt="Gallery View"
           width="420"
           src="https://github.com/user-attachments/assets/328e031f-85b8-42b2-81a8-e313d78538e8" />
    </td>
    <td>
      <img alt="Search View"
           width="420"
           src="https://github.com/user-attachments/assets/37737553-c9aa-44fc-8bfd-17b20bc8ac31" />
    </td>
    
  </tr>
</table>

---

## ✨ Features

### Core Functionality
- Search artworks via Art Institute of Chicago API
- Runtime validation of API responses using **Zod**
- Type-safe models using `z.infer`
- Add artworks to personal gallery
- Remove artworks from gallery
- Attach personal notes (max 200 characters)
- Persistent storage via LocalStorage
- Automatic featured artwork preview on landing page
- Smooth fade transition between featured artworks

### UI / UX
- Responsive card-based layout
- Hover animations for artwork cards
- Clean hero-style landing preview
- View switching (Search ↔ Gallery)
- Modern spacing & visual hierarchy with TailwindCSS

---

## 🧠 Architecture

```
src/
├── api/
│   └── aic.ts
├── components/
│   ├── Search.tsx
│   ├── Gallery.tsx
│   └── ArtworkCard.tsx
├── schemas/
│   ├── artwork.ts
│   └── note.ts
├── storage/
│   └── gallery.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Architectural Principles

**API Layer (`api/aic.ts`)**
- Encapsulates fetch logic
- Constructs IIIF image URLs
- Isolated network responsibility

**Schema Layer (`schemas/`)**
- Zod runtime validation
- Prevents invalid API data from entering UI
- Full TypeScript type reuse via `z.infer`

**Storage Layer (`storage/gallery.ts`)**
- Encapsulated LocalStorage access
- Centralized CRUD logic
- Schema-safe persistence

**UI Layer**
- `Search` → search + landing preview
- `Gallery` → saved artworks + notes
- `ArtworkCard` → reusable display component
- `App` → top-level state orchestration

---

## 🛠 Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Zod**
- **Art Institute of Chicago API**
- **LocalStorage API**

---

## 🌐 API Reference

Data provided by:

**Art Institute of Chicago API**  
https://api.artic.edu/api/v1

Images served via **IIIF**:

```
https://www.artic.edu/iiif/2/{image_id}/full/{width},/0/default.jpg
```

---

## 🚀 Getting Started

```bash
git clone git@github.com:Codenix-1349/Art_Institue_Explorer.git
cd Art_Institue_Explorer
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 🎯 What This Project Demonstrates

- Clean separation of concerns
- API contract validation (runtime + static typing)
- Controlled components & predictable state updates
- Persistent client-side state
- Reusable UI abstraction patterns
- Conditional rendering & view orchestration
- Responsive layout composition with TailwindCSS

---

## 📦 Possible Next Improvements

- Pagination / infinite scroll
- Sorting (artist, title)
- Advanced filtering (date, department)
- Backend persistence
- Authentication
- Unit testing (Vitest)

---

## 👨‍💻 Author

Patrick Neumann  
GitHub: https://github.com/Codenix-1349  
LinkedIn: https://linkedin.com/in/patrick-neumann-532367276  




