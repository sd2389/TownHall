# File Upload Security Implementation

## Overview

This document describes the comprehensive security measures implemented to prevent upload of harmful or executable files in the TownHall application.

## Security Layers

The file upload security is implemented using a **defense-in-depth** approach with multiple validation layers:

### 1. Frontend Validation (Client-Side)

**Location**: `frontend/src/lib/fileValidation.ts`

**Purpose**: First line of defense - prevents invalid files from being sent to the server.

**Validations**:
- ✅ File extension whitelist validation
- ✅ Dangerous extension blacklist check
- ✅ MIME type validation
- ✅ File size limits (10MB max)
- ✅ Filename sanitization
- ✅ Path traversal prevention

**Allowed File Types**:
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`, `.svg`
- **Documents**: `.pdf`, `.doc`, `.docx`, `.txt`, `.rtf`
- **Spreadsheets**: `.xls`, `.xlsx`, `.csv`

**Blocked File Types** (Examples):
- Executables: `.exe`, `.bat`, `.cmd`, `.com`, `.scr`, `.vbs`, `.js`, `.jar`, `.msi`, `.dll`
- Scripts: `.sh`, `.bash`, `.ps1`, `.py`, `.php`, `.pl`, `.rb`, `.asp`, `.jsp`
- Archives: `.zip`, `.rar`, `.7z`, `.tar`, `.gz` (could contain executables)
- Other: `.dmg`, `.iso`, `.bin`, `.run`, `.apk`, `.ipa`

### 2. Backend Validation (Server-Side)

**Location**: `citizen/file_validator.py`

**Purpose**: Critical security layer - server-side validation that cannot be bypassed.

**Validations**:
- ✅ File extension whitelist validation
- ✅ Dangerous extension blacklist check
- ✅ MIME type validation
- ✅ File size limits (10MB max)
- ✅ **Magic bytes (file signature) validation** - Prevents file type spoofing
- ✅ **Content scanning** - Detects executable code patterns
- ✅ Filename sanitization
- ✅ Path traversal prevention

**Magic Bytes Validation**:
The system validates file content using file signatures (magic bytes) to ensure files match their claimed type. This prevents attackers from renaming executable files to appear as safe file types.

**Supported Magic Bytes**:
- JPEG: `FF D8 FF`
- PNG: `89 50 4E 47 0D 0A 1A 0A`
- GIF: `GIF87a` or `GIF89a`
- PDF: `%PDF`
- DOC: `D0 CF 11 E0 A1 B1 1A E1` (legacy MS Office)
- DOCX/XLSX: `PK 03 04` (ZIP-based Office Open XML)

**Content Scanning**:
The validator scans file content for executable signatures:
- Windows PE executables: `MZ`
- Linux ELF executables: `7F ELF`
- Shell scripts: `#!/bin/`, `#!/usr/bin/`
- Script tags: `<script`, `<?php`, `<%@`

### 3. Filename Sanitization

**Purpose**: Prevents directory traversal attacks and other filename-based exploits.

**Sanitization Rules**:
- Removes path components (`/`, `\`)
- Removes dangerous characters: `<>:"|?*` and control characters
- Removes leading/trailing dots and spaces
- Limits filename length to 255 characters
- Ensures filename is not empty

### 4. File Storage Security

**Location**: `citizen/models.py` - `ComplaintAttachment` model

**Security Measures**:
- Files stored in isolated directory: `complaints/%Y/%m/%d/`
- Original filenames are sanitized before storage
- File metadata (type, size) is stored separately for validation

## Implementation Details

### Frontend Usage

```typescript
import { validateFile, validateFiles } from "@/lib/fileValidation";

// Validate single file
const result = validateFile(file);
if (!result.isValid) {
  console.error(result.error);
}

// Validate multiple files
const { validFiles, errors } = validateFiles(files);
```

### Backend Usage

```python
from citizen.file_validator import validate_uploaded_file, sanitize_filename

# Validate file
is_valid, error_message = validate_uploaded_file(uploaded_file)
if not is_valid:
    logger.warning(f"File rejected: {error_message}")
    continue

# Sanitize filename
sanitized_name = sanitize_filename(uploaded_file.name)
```

## Security Best Practices

### ✅ Implemented

1. **Whitelist Approach**: Only explicitly allowed file types are accepted
2. **Multiple Validation Layers**: Frontend + Backend validation
3. **Magic Bytes Validation**: Prevents file type spoofing
4. **Content Scanning**: Detects executable code patterns
5. **Filename Sanitization**: Prevents path traversal
6. **Size Limits**: Prevents DoS attacks via large files
7. **Error Logging**: Security events are logged for monitoring

### 🔒 Additional Recommendations

For production environments, consider:

1. **Virus Scanning**: Integrate ClamAV or similar antivirus solution
2. **File Quarantine**: Store files in quarantine before making them accessible
3. **Content Security Policy (CSP)**: Already configured in Django settings
4. **Rate Limiting**: Limit upload frequency per user/IP
5. **File Scanning Service**: Use cloud-based file scanning (e.g., VirusTotal API)
6. **Sandbox Execution**: For critical files, consider sandboxed execution environments

## Testing Security

### Test Cases

1. **Executable File Upload**:
   - Try uploading `.exe` file → Should be rejected
   - Try renaming `.exe` to `.jpg` → Should be rejected (magic bytes check)

2. **Script File Upload**:
   - Try uploading `.sh`, `.bat`, `.php` → Should be rejected

3. **Archive Upload**:
   - Try uploading `.zip`, `.rar` → Should be rejected

4. **File Type Spoofing**:
   - Create executable file, rename to `.pdf` → Should be rejected (magic bytes)

5. **Path Traversal**:
   - Try filename `../../../etc/passwd` → Should be sanitized

6. **Size Limits**:
   - Try uploading file > 10MB → Should be rejected

7. **MIME Type Mismatch**:
   - File with `.jpg` extension but `application/x-executable` MIME type → Should be rejected

## Monitoring & Logging

Security events are logged for monitoring:

```python
logger.warning(f"File upload rejected: {filename} - {error_message}")
logger.error(f"Error processing file upload: {filename} - {error}")
```

Monitor these logs for:
- Repeated upload attempts with dangerous files
- File type spoofing attempts
- Unusual upload patterns

## Compliance

This implementation follows security best practices from:
- OWASP File Upload Security Guidelines
- CWE-434: Unrestricted Upload of File with Dangerous Type
- CWE-73: External Control of File Name or Path

## Updates & Maintenance

### Adding New File Types

To add a new allowed file type:

1. **Frontend** (`fileValidation.ts`):
   - Add extension to `ALLOWED_EXTENSIONS`
   - Add MIME type to `ALLOWED_MIME_TYPES`

2. **Backend** (`file_validator.py`):
   - Add extension to `ALLOWED_EXTENSIONS`
   - Add MIME type to `ALLOWED_MIME_TYPES`
   - Add magic bytes to `MAGIC_BYTES` (if applicable)

### Updating Security Rules

When updating security rules:
1. Update both frontend and backend validators
2. Test thoroughly with malicious files
3. Update this documentation
4. Notify users of changes

## Support

For security concerns or to report vulnerabilities, please contact the development team.

---

**Last Updated**: 2025-01-27  
**Version**: 1.0
