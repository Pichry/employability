"""Tests for data validation module."""
import pytest
from data.ingest.validation import SchemaValidator, ValidationLevel


class TestSchemaValidator:
    def test_required_field_null(self):
        v = SchemaValidator()
        v.add_field("student_number", str, nullable=False)
        result = v.validate_row({"student_number": None})
        assert not result.is_valid

    def test_nullable_field_null(self):
        v = SchemaValidator()
        v.add_field("email", str, nullable=True)
        result = v.validate_row({"email": None})
        assert result.is_valid
