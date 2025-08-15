# Solution Review Management Frontend

A modern React TypeScript application for managing enterprise solution architecture reviews with comprehensive document lifecycle management.

## Features

### 🔄 Document Lifecycle Management

- **DRAFT**: Create and edit solution reviews
- **SUBMITTED**: Submit reviews for approval
- **CURRENT**: Approved and active reviews
- **OUTDATED**: Superseded historical versions

### 📊 Dashboard & Analytics

- **Dual View Modes**: Systems view (grouped by system) and Reviews view (individual reviews)
- **System-Based Organization**: Each system shows all versions with latest/current status
- **Version Management**: Track multiple versions of solution reviews per system
- State-based filtering and search functionality
- Real-time statistics and counts
- Responsive card-based layout

### 🏗️ Solution Architecture Components

- **Solution Overview**: Title, description, business value, stakeholders
- **Business Capabilities**: Domain-specific capabilities
- **System Components**: Technology stack components
- **Integration Flows**: System integration mappings
- **Data Assets**: Data management specifications
- **Technology Components**: Technical infrastructure
- **Enterprise Tools**: Tooling and platform specifications
- **Process Compliance**: Regulatory and compliance tracking

### 💼 User Experience

- Clean, minimal interface design
- Responsive mobile and desktop layouts
- Modal-based creation and editing workflows
- State transition validation and actions
- Real-time updates and feedback

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context with useReducer
- **Build Tool**: Vite for fast development and building
- **Type Safety**: Full TypeScript coverage
- **Mock API**: Development-ready mock service layer

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── SolutionReviewCard.tsx
│   ├── SolutionReviewDetail.tsx
│   └── CreateSolutionReviewModal.tsx
├── context/             # React Context providers
│   └── SolutionReviewContext.tsx
├── services/            # API and service layers
│   └── mockApi.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main application component
```

## API Integration

The application is designed to work with the backend Spring Boot core-service and supports a **system-versioning approach** where each group of solution reviews represents one system with multiple versions.

### System-Centric Data Model

The frontend now organizes solution reviews by **systems**, where:

- Each system has a unique `systemId` and `systemName`
- Multiple solution reviews belong to the same system (different versions)
- Each review has a `version` number within its system
- Only one review per system should be in `CURRENT` state at any time

### Expected API Endpoints

The mock API service (`mockApi.ts`) simulates the following backend endpoints:

#### Solution Review Endpoints

- `GET /api/solution-reviews` - Get all reviews
- `GET /api/solution-reviews/{id}` - Get specific review
- `POST /api/solution-reviews` - Create new review (auto-assigns systemId/version)
- `PUT /api/solution-reviews/{id}` - Update review
- `DELETE /api/solution-reviews/{id}` - Delete review
- `PUT /api/solution-reviews/{id}/state` - Transition document state

#### System-Based Endpoints (New)

- `GET /api/systems` - Get all systems with their review summaries
- `GET /api/systems/{systemId}` - Get specific system with all versions
- `GET /api/systems/{systemId}/reviews` - Get all reviews for a system (sorted by version)
- `POST /api/systems/{systemId}/reviews` - Create new version for existing system

### System Grouping Logic

```typescript
interface SystemGroup {
  systemId: string;
  systemName: string;
  description: string;
  category: string;
  reviews: SolutionReview[]; // All versions, sorted by version desc
  latestVersion: number;
  currentReview?: SolutionReview; // The review in CURRENT state
  totalReviews: number;
}
```

### Backend Implementation Guidance

To support this system-versioning approach, the backend should:

1. **Auto-assign systemId/systemName** when creating new reviews if not provided
2. **Generate version numbers** automatically (next version for existing system)
3. **Enforce state constraints**: Only one CURRENT review per system
4. **Provide system aggregation endpoints** that group reviews by system
5. **Support version comparison** queries for change tracking

### Example API Responses

#### GET /api/systems

```json
[
  {
    "systemId": "sys-cdp-001",
    "systemName": "Customer Data Platform",
    "description": "Unified customer data platform...",
    "category": "Data Management",
    "latestVersion": 3,
    "totalReviews": 3,
    "currentReview": {
      "id": "2",
      "version": 2,
      "documentState": "CURRENT"
      // ... other review fields
    },
    "reviews": [
      { "id": "3", "version": 3, "documentState": "DRAFT" },
      { "id": "2", "version": 2, "documentState": "CURRENT" },
      { "id": "1", "version": 1, "documentState": "OUTDATED" }
    ]
  }
]
```

#### POST /api/solution-reviews (Create New System)

```json
{
  "solutionOverview": {
    "title": "New System Implementation",
    "description": "..."
    // ... other fields
  }
}
```

**Response**: Auto-generates `systemId`, `systemName`, and `version: 1`

#### POST /api/systems/{systemId}/reviews (Create New Version)

```json
{
  "solutionOverview": {
    "title": "Enhanced System Implementation v2"
    // ... updated fields
  }
}
```

**Response**: Uses existing `systemId`/`systemName`, auto-increments version

## Key Components

### Document State Management

Based on the backend `DocumentState` enum with transitions:

- DRAFT → SUBMITTED (Submit for Review)
- SUBMITTED → CURRENT (Approve) | DRAFT (Return to Draft)
- CURRENT → OUTDATED (Mark as Outdated) | SUBMITTED (Unapprove)
- OUTDATED → CURRENT (Reset as Current)

### Solution Review Structure

Mirrors the backend `SolutionReviewDTO` with:

- Complete solution overview metadata
- Collections of architecture components
- Version control and audit trail
- Document state tracking

## Development Notes

- The application uses React Context for state management to avoid prop drilling
- All components are fully typed with TypeScript
- Responsive design principles applied throughout
- Mock data service ready for backend integration
- Error handling and loading states implemented
- Form validation and user feedback included

## Future Enhancements

- Real backend API integration
- Advanced filtering and sorting
- Export/import functionality
- Collaboration features
- Document version comparison
- Advanced analytics and reporting

## Contributing

1. Follow TypeScript strict mode guidelines
2. Use Tailwind CSS for all styling
3. Maintain component reusability
4. Ensure responsive design compatibility
5. Add proper error handling for new features
