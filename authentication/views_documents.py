"""
User Document Views
Handles user document upload, list, and delete operations
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import UserDocument
from citizen.file_validator import validate_uploaded_file, sanitize_filename
from django.core.files.storage import default_storage
import os
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_documents_view(request):
    """List user documents (GET) or upload document (POST)"""
    if request.method == 'GET':
        try:
            documents = UserDocument.objects.filter(user=request.user)
            
            # Filter by document type if provided
            doc_type = request.query_params.get('type', None)
            if doc_type:
                documents = documents.filter(document_type=doc_type)
            
            data = []
            for doc in documents:
                data.append({
                    'id': doc.id,
                    'document_type': doc.document_type,
                    'document_type_display': doc.get_document_type_display(),
                    'file_name': doc.file_name,
                    'file_type': doc.file_type,
                    'file_size': doc.file_size,
                    'file_url': doc.file.url if doc.file else None,
                    'description': doc.description,
                    'uploaded_at': doc.uploaded_at.strftime('%Y-%m-%d %H:%M:%S'),
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error listing user documents: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        try:
            # Get file from request
            if 'file' not in request.FILES:
                return Response({
                    'error': 'No file provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            uploaded_file = request.FILES['file']
            
            # Validate file
            is_valid, error_message = validate_uploaded_file(uploaded_file)
            if not is_valid:
                return Response({
                    'error': f'File validation failed: {error_message}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Sanitize filename
            sanitized_name = sanitize_filename(uploaded_file.name)
            file_type = uploaded_file.content_type or os.path.splitext(sanitized_name)[1].lower()
            
            # Get document type from request
            document_type = request.data.get('document_type', 'id_document')
            description = request.data.get('description', '').strip()
            
            # Create document record
            document = UserDocument.objects.create(
                user=request.user,
                document_type=document_type,
                file=uploaded_file,
                file_name=sanitized_name,
                file_type=file_type,
                file_size=uploaded_file.size,
                description=description,
            )
            
            return Response({
                'message': 'Document uploaded successfully',
                'document': {
                    'id': document.id,
                    'document_type': document.document_type,
                    'document_type_display': document.get_document_type_display(),
                    'file_name': document.file_name,
                    'file_type': document.file_type,
                    'file_size': document.file_size,
                    'file_url': document.file.url if document.file else None,
                    'description': document.description,
                    'uploaded_at': document.uploaded_at.strftime('%Y-%m-%d %H:%M:%S'),
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_document_detail_view(request, document_id):
    """Delete a user document"""
    try:
        try:
            document = UserDocument.objects.get(id=document_id, user=request.user)
        except UserDocument.DoesNotExist:
            return Response({
                'error': 'Document not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the file from storage
        if document.file:
            try:
                document.file.delete(save=False)
            except Exception as e:
                logger.warning(f"Error deleting file from storage: {str(e)}")
        
        # Delete the document record
        document.delete()
        
        return Response({
            'message': 'Document deleted successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}")
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







