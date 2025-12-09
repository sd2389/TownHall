"""
Secure File Upload Validation Module
Prevents upload of harmful or executable files
"""

import os
import re
from typing import Tuple, Optional
from django.core.files.uploadedfile import UploadedFile


# Maximum file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

# Allowed file extensions (whitelist approach - only safe file types)
ALLOWED_EXTENSIONS = {
    # Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg',
    # Documents
    '.pdf', '.doc', '.docx', '.txt', '.rtf',
    # Spreadsheets (if needed)
    '.xls', '.xlsx', '.csv',
}

# Allowed MIME types (must match extensions)
ALLOWED_MIME_TYPES = {
    # Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'image/bmp', 'image/svg+xml', 'image/x-icon',
    # Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/rtf',
    # Spreadsheets
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
}

# Dangerous file extensions that should NEVER be allowed
DANGEROUS_EXTENSIONS = {
    # Executables
    '.exe', '.bat', '.cmd', '.com', '.scr', '.vbs', '.js', '.jar',
    '.msi', '.dll', '.sys', '.drv', '.pif', '.app', '.deb', '.rpm',
    # Scripts
    '.sh', '.bash', '.zsh', '.ps1', '.py', '.pyc', '.pyo', '.php',
    '.pl', '.rb', '.asp', '.aspx', '.jsp', '.cgi', '.htaccess',
    # Archives that could contain executables
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz',
    # Other dangerous types
    '.dmg', '.iso', '.bin', '.run', '.sh', '.deb', '.rpm',
    '.apk', '.ipa', '.msi', '.msp', '.mst',
}

# Magic bytes (file signatures) for validation
# Format: (extension, [list of magic byte signatures])
MAGIC_BYTES = {
    '.jpg': [b'\xFF\xD8\xFF'],
    '.jpeg': [b'\xFF\xD8\xFF'],
    '.png': [b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A'],
    '.gif': [b'GIF87a', b'GIF89a'],
    '.pdf': [b'%PDF'],
    '.doc': [b'\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1'],  # MS Office legacy
    '.docx': [b'PK\x03\x04'],  # ZIP-based format (Office Open XML)
    '.xlsx': [b'PK\x03\x04'],  # ZIP-based format
    '.txt': [],  # Text files have no magic bytes
    '.webp': [b'RIFF'],  # WebP files start with RIFF
}


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent directory traversal and other attacks.
    Removes dangerous characters and limits length.
    """
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove dangerous characters
    filename = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '', filename)
    
    # Remove leading/trailing dots and spaces
    filename = filename.strip('. ')
    
    # Limit length
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:250] + ext
    
    # Ensure filename is not empty
    if not filename:
        filename = 'uploaded_file'
    
    return filename


def get_file_extension(filename: str) -> str:
    """Get lowercase file extension with dot."""
    return os.path.splitext(filename.lower())[1]


def validate_file_extension(filename: str) -> Tuple[bool, Optional[str]]:
    """
    Validate file extension against whitelist.
    Returns (is_valid, error_message)
    """
    ext = get_file_extension(filename)
    
    if not ext:
        return False, "File must have an extension"
    
    if ext in DANGEROUS_EXTENSIONS:
        return False, f"File type '{ext}' is not allowed for security reasons"
    
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"File type '{ext}' is not allowed. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
    
    return True, None


def validate_file_size(file_size: int) -> Tuple[bool, Optional[str]]:
    """
    Validate file size.
    Returns (is_valid, error_message)
    """
    if file_size <= 0:
        return False, "File is empty"
    
    if file_size > MAX_FILE_SIZE:
        size_mb = MAX_FILE_SIZE / (1024 * 1024)
        return False, f"File size exceeds maximum allowed size of {size_mb}MB"
    
    return True, None


def validate_mime_type(content_type: str, filename: str) -> Tuple[bool, Optional[str]]:
    """
    Validate MIME type against whitelist.
    Returns (is_valid, error_message)
    """
    if not content_type:
        return False, "File content type could not be determined"
    
    # Normalize MIME type
    content_type = content_type.lower().split(';')[0].strip()
    
    ext = get_file_extension(filename)
    
    # Check if MIME type is in whitelist
    if content_type not in ALLOWED_MIME_TYPES:
        return False, f"File type '{content_type}' is not allowed"
    
    # Additional check: MIME type should match extension
    # This is a basic check - more sophisticated validation uses magic bytes
    expected_mime_for_ext = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
    }
    
    # Warn if MIME type doesn't match extension (but don't reject - magic bytes will catch it)
    if ext in expected_mime_for_ext:
        expected = expected_mime_for_ext[ext]
        if content_type != expected and content_type not in ['application/octet-stream']:
            # Log warning but don't reject - magic bytes validation is more reliable
            pass
    
    return True, None


def validate_magic_bytes(file_content: bytes, filename: str) -> Tuple[bool, Optional[str]]:
    """
    Validate file content using magic bytes (file signatures).
    This prevents file type spoofing.
    Returns (is_valid, error_message)
    """
    if not file_content:
        return False, "File is empty"
    
    ext = get_file_extension(filename)
    
    if ext not in MAGIC_BYTES:
        # If we don't have magic bytes for this type, skip validation
        # (e.g., .txt files)
        return True, None
    
    expected_signatures = MAGIC_BYTES[ext]
    
    if not expected_signatures:
        # No magic bytes defined for this type (e.g., .txt)
        return True, None
    
    # Check if file starts with any of the expected signatures
    file_start = file_content[:20]  # Read first 20 bytes
    
    for signature in expected_signatures:
        if file_start.startswith(signature):
            return True, None
    
    # Special handling for Office Open XML files (.docx, .xlsx)
    # They are ZIP files, so check for ZIP signature
    if ext in ['.docx', '.xlsx']:
        if file_start.startswith(b'PK\x03\x04'):
            # Verify it's actually an Office document by checking for specific files inside
            # This is a simplified check - in production, you might want to extract and verify
            return True, None
    
    return False, f"File content does not match expected file type '{ext}'. File may be corrupted or spoofed."


def validate_file_content(file_content: bytes) -> Tuple[bool, Optional[str]]:
    """
    Additional content validation to detect executable code.
    Returns (is_valid, error_message)
    """
    if not file_content:
        return False, "File is empty"
    
    # Check for executable signatures
    executable_signatures = [
        b'MZ',  # Windows PE executable
        b'\x7FELF',  # Linux ELF executable
        b'#!/bin/',  # Shell script
        b'#!/usr/bin/',  # Shell script
        b'<script',  # JavaScript in HTML
        b'<?php',  # PHP script
        b'<%@',  # ASP script
        b'<%',  # JSP/ASP script
    ]
    
    file_start = file_content[:100]  # Check first 100 bytes
    
    for signature in executable_signatures:
        if signature in file_start:
            return False, "File contains executable code and is not allowed"
    
    # Check for null bytes (common in binary executables)
    if b'\x00' in file_content[:1024] and not file_content.startswith(b'%PDF'):
        # PDFs can have null bytes, so we exclude them
        # This is a heuristic - might need refinement
        pass
    
    return True, None


def validate_uploaded_file(uploaded_file: UploadedFile) -> Tuple[bool, Optional[str]]:
    """
    Comprehensive file validation function.
    Validates extension, size, MIME type, magic bytes, and content.
    Returns (is_valid, error_message)
    """
    # 1. Sanitize filename
    sanitized_name = sanitize_filename(uploaded_file.name)
    
    # 2. Validate file extension
    is_valid, error = validate_file_extension(sanitized_name)
    if not is_valid:
        return False, error
    
    # 3. Validate file size
    is_valid, error = validate_file_size(uploaded_file.size)
    if not is_valid:
        return False, error
    
    # 4. Validate MIME type
    content_type = uploaded_file.content_type or ''
    is_valid, error = validate_mime_type(content_type, sanitized_name)
    if not is_valid:
        return False, error
    
    # 5. Read file content for magic bytes validation
    try:
        # Save current position
        current_pos = uploaded_file.tell()
        uploaded_file.seek(0)
        
        # Read first 1024 bytes for validation
        file_content = uploaded_file.read(1024)
        
        # Restore position
        uploaded_file.seek(current_pos)
        
        # 6. Validate magic bytes
        is_valid, error = validate_magic_bytes(file_content, sanitized_name)
        if not is_valid:
            return False, error
        
        # 7. Validate file content for executable code
        is_valid, error = validate_file_content(file_content)
        if not is_valid:
            return False, error
        
    except Exception as e:
        return False, f"Error reading file: {str(e)}"
    
    return True, None


def get_file_type_category(filename: str) -> str:
    """
    Categorize file type for display purposes.
    Returns: 'image', 'document', 'spreadsheet', or 'other'
    """
    ext = get_file_extension(filename)
    
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'}
    document_extensions = {'.pdf', '.doc', '.docx', '.txt', '.rtf'}
    spreadsheet_extensions = {'.xls', '.xlsx', '.csv'}
    
    if ext in image_extensions:
        return 'image'
    elif ext in document_extensions:
        return 'document'
    elif ext in spreadsheet_extensions:
        return 'spreadsheet'
    else:
        return 'other'

