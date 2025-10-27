# API Services Documentation

## Overview

This document provides examples of how to use the API services in the Material Management Frontend application.

## Installation

The API services use axios for HTTP requests and include automatic token management, request/response interceptors, and TypeScript support.

## Configuration

Set the API base URL in your environment file (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8088/api/v1
```

## Authentication

### Login

```typescript
import { authService } from '@/services';

const handleLogin = async () => {
  try {
    const response = await authService.login({
      username: 'admin',
      password: 'password123'
    });
    
    if (response.status) {
      console.log('Login successful');
      // Tokens are automatically stored
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Logout

```typescript
const handleLogout = async () => {
  try {
    await authService.logout();
    // Tokens are automatically cleared
    // Redirect to login page
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

### Check Authentication Status

```typescript
const isLoggedIn = authService.isAuthenticated();
```

## Equipment Machinery

### Create Equipment Machinery

```typescript
import { equipmentMachineryService } from '@/services';

const createEquipment = async () => {
  try {
    const response = await equipmentMachineryService.create({
      name: 'Excavator CAT 320',
      sector: 'Construction',
      order: 1
    });
    
    if (response.status) {
      console.log('Equipment created:', response.data);
    }
  } catch (error) {
    console.error('Failed to create equipment:', error);
  }
};
```

### Filter Equipment Machinery

```typescript
const getEquipmentBySector = async () => {
  try {
    const response = await equipmentMachineryService.getBySector('Construction');
    
    if (response.status && response.data) {
      console.log('Equipment list:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
  }
};
```

## Material Requests

### Create Material Request

```typescript
import { materialRequestService } from '@/services';

const createMaterialRequest = async () => {
  try {
    const response = await materialRequestService.create({
      maintenance_number: 'MNT-2024-001',
      maintenance_tier: 'Tier 1',
      project: 'Project Alpha',
      sector: 'Construction',
      materials_for_equipment: {
        'equipment-1': {
          consumable_supplies: {
            'oil': {
              name: 'Engine Oil',
              quantity: 10,
              unit: 'liters'
            }
          },
          replacement_materials: {
            'filter': {
              name: 'Air Filter',
              quantity: 2,
              unit: 'pieces'
            }
          }
        }
      },
      description: 'Monthly maintenance materials'
    });
    
    if (response.status) {
      console.log('Material request created:', response.data);
    }
  } catch (error) {
    console.error('Failed to create material request:', error);
  }
};
```

### Filter Material Requests

```typescript
const getMaterialRequestsBySector = async () => {
  try {
    const response = await materialRequestService.getBySector('Construction');
    
    if (response.status && response.data) {
      console.log('Material requests:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch material requests:', error);
  }
};
```

### Export Material Request

```typescript
const exportMaterialRequest = async (requestId: string) => {
  try {
    await materialRequestService.downloadExport(requestId, `request-${requestId}.docx`);
    console.log('Export downloaded successfully');
  } catch (error) {
    console.error('Failed to export material request:', error);
  }
};
```

## Materials Profile

### Upload Materials Estimate

```typescript
import { materialsProfileService } from '@/services';

const uploadEstimate = async (file: File) => {
  try {
    const response = await materialsProfileService.uploadEstimate(file, {
      project: 'Project Alpha',
      maintenance_tier: 'Tier 1',
      maintenance_number: 'MNT-2024-001',
      sheet_name: 'Materials',
      sector: 'Construction'
    });
    
    if (response.status) {
      console.log('Upload successful');
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Get Materials Profile

```typescript
const getMaterialsProfiles = async () => {
  try {
    const response = await materialsProfileService.getByProject('Project Alpha');
    
    if (response.status && response.data) {
      console.log('Materials profiles:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch materials profiles:', error);
  }
};
```

## Using with React Hooks

### Basic API Call with useApi Hook

```typescript
import { useApi } from '@/hooks/useApi';
import { materialRequestService } from '@/services';

function MaterialRequestsList() {
  const {
    data: requests,
    loading,
    error,
    execute: refetch
  } = useApi(
    () => materialRequestService.getAll(),
    { immediate: true }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {requests?.data?.map(request => (
        <div key={request.id}>
          {request.description}
        </div>
      ))}
    </div>
  );
}
```

### Async Operations with useAsync Hook

```typescript
import { useAsync } from '@/hooks/useApi';
import { equipmentMachineryService } from '@/services';

function EquipmentList({ sector }: { sector: string }) {
  const {
    data: equipment,
    loading,
    error
  } = useAsync(
    () => equipmentMachineryService.getBySector(sector),
    [sector]
  );

  if (loading) return <div>Loading equipment...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {equipment?.data?.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## Error Handling

All API services include automatic error handling with:

- Automatic token refresh on 401 errors
- Request/response logging
- Consistent error formatting
- Automatic redirect to login on authentication failure

## TypeScript Support

All services include full TypeScript support with:

- Strongly typed request/response interfaces
- Generic type support for API responses
- IntelliSense and autocomplete
- Compile-time error checking
