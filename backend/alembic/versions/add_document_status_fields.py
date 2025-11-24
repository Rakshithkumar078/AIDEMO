"""Add document status fields

Revision ID: add_document_status
Revises: 
Create Date: 2024-11-20 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_document_status'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    # Add status enum type
    processing_stage_enum = postgresql.ENUM(
        'uploading', 'processing', 'embedding', 'completed', 'error',
        name='processingstage'
    )
    processing_stage_enum.create(op.get_bind())
    
    # Add new columns to documents table
    op.add_column('documents', sa.Column('status', processing_stage_enum, server_default='uploading'))
    op.add_column('documents', sa.Column('processing_progress', sa.Integer(), server_default='0'))
    op.add_column('documents', sa.Column('processing_message', sa.String(), server_default='Starting upload...'))
    op.add_column('documents', sa.Column('processing_error', sa.String(), nullable=True))

def downgrade():
    # Remove columns
    op.drop_column('documents', 'processing_error')
    op.drop_column('documents', 'processing_message')
    op.drop_column('documents', 'processing_progress')
    op.drop_column('documents', 'status')
    
    # Drop enum type
    processing_stage_enum = postgresql.ENUM(name='processingstage')
    processing_stage_enum.drop(op.get_bind())