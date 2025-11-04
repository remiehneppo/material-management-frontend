# Upload Estimate Feature

## Overview
This feature allows users to upload Excel files (.xlsx, .xls) containing material estimates for projects. The uploaded data is processed and stored in the database with associated metadata.

## How to Use

### 1. Open Upload Modal
- Navigate to the Materials page (`/materials`)
- Click the "Cập nhật dự toán" (Update Estimate) button in the action bar
- A modal dialog will appear

### 2. Fill in Required Information

The upload form requires the following fields:

#### File Upload **(Required)**
- **Format**: Excel files (.xlsx, .xls)
- **Action**: Click the upload area or drag & drop the file
- **Validation**: System checks file extension

#### Project **(Required)**
- **Field**: Text input
- **Description**: Name of the project
- **Example**: "Dự án sửa chữa tàu HQ-123"

#### Maintenance Tier **(Required)**
- **Field**: Dropdown select
- **Options**:
  - SCCĐ (Dock Maintenance)
  - SCCN (Small Maintenance)
  - SCCV (Medium Maintenance)

#### Maintenance Number **(Required)**
- **Field**: Text input
- **Description**: The maintenance occurrence number
- **Example**: "1", "2", "3"

#### Sheet Name **(Required)**
- **Field**: Text input
- **Description**: Name of the Excel sheet to process
- **Example**: "Sheet1", "Vật tư", "Estimates"

#### Sector **(Required)**
- **Field**: Dropdown select
- **Options**:
  - Cơ khí (Mechanical)
  - Vũ khí (Weapons)
  - Vỏ Tàu (Hull)
  - Đà đốc (Dock)
  - Điện tàu (Electronics)
  - Động lực (Propulsion)
  - Van ống (Valve & Pipe)
  - KT-ĐT (Electronics Tactical)
  - Trang trí (Decorative)
  - Cơ điện (Electrical)

### 3. Submit Upload
- Review all filled information
- Click "Upload" button
- Wait for upload to complete (spinner will show during upload)
- On success: Alert message and modal closes automatically
- On error: Error message displayed in modal

### 4. After Upload
- The materials table will automatically refresh with new data
- New material profiles will be visible in the list

## Features

### Validation
✅ File type validation (only .xlsx and .xls)
✅ Required field validation
✅ Form state management
✅ Disabled state during upload

### User Experience
✅ Clean modal interface
✅ Loading spinner during upload
✅ Error messages with clear icons
✅ Success notifications
✅ Automatic data refresh after upload

### Error Handling
✅ Network errors
✅ Invalid file formats
✅ Missing required fields
✅ Server-side validation errors

## Technical Details

### Components

#### UploadEstimateModal
**Location**: `/src/components/materials/UploadEstimateModal.tsx`

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `onSuccess: () => void` - Callback on successful upload

**State Management**:
```typescript
formData: {
  project: string;
  maintenance_tier: string;
  maintenance_number: string;
  sheet_name: string;
  sector: string;
}
file: File | null;
uploading: boolean;
error: string | null;
```

### API Integration

**Service**: `materialsProfileService.uploadEstimate()`

**Endpoint**: `POST /materials-profiles/upload-estimate`

**Request**:
- Content-Type: `multipart/form-data`
- File: Excel file
- Request body: JSON string of metadata

**Response**:
```typescript
{
  status: boolean;
  message: string;
}
```

### File Structure
```
src/
  components/
    materials/
      UploadEstimateModal.tsx  # Upload modal component
  app/
    materials/
      page.tsx                  # Materials page with modal integration
  services/
    materialsProfileService.ts  # Service with upload method
  types/
    api.ts                      # Type definitions
```

## Excel File Format

The Excel file should contain material estimates with the following expected structure:
- Equipment/machinery information
- Consumable supplies
- Replacement materials
- Quantities and units

(Specific format depends on backend parsing requirements)

## Future Improvements

- [ ] Add file preview before upload
- [ ] Support multiple file upload
- [ ] Add progress bar for large files
- [ ] Template download for Excel format
- [ ] Drag & drop file support
- [ ] Validation of Excel content before upload
- [ ] History of uploaded files
- [ ] Edit uploaded estimates

## Troubleshooting

### Upload Fails
1. Check file format (.xlsx or .xls)
2. Verify all required fields are filled
3. Ensure sheet name matches actual sheet in Excel
4. Check network connection
5. Verify user has upload permissions

### Modal Doesn't Close
- Wait for upload to complete
- Check for error messages
- Close modal manually with X button

### Data Doesn't Refresh
- Manual refresh: Clear filters and re-apply
- Check browser console for errors
- Verify upload was successful
