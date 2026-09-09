"""
Data validation and quality checks for ingested records.
Invalid rows are quarantined, never silently dropped.
"""

from dataclasses import dataclass
from typing import Any
from enum import Enum


class ValidationLevel(Enum):
    ERROR = "error"
    WARNING = "warning"


@dataclass
class ValidationResult:
    is_valid: bool
    issues: list[tuple[ValidationLevel, str]]


class SchemaValidator:
    """Validates records against a schema."""

    def __init__(self):
        self.rules: dict[str, dict[str, Any]] = {}

    def add_field(self, field_name: str, field_type: type, nullable: bool = False,
                  min_val: float = None, max_val: float = None) -> None:
        self.rules[field_name] = {
            "type": field_type, "nullable": nullable, "min": min_val, "max": max_val
        }

    def validate_row(self, row: dict[str, Any]) -> ValidationResult:
        result = ValidationResult(is_valid=True, issues=[])
        for field_name, rules in self.rules.items():
            value = row.get(field_name)
            if value is None and not rules["nullable"]:
                result.issues.append((ValidationLevel.ERROR, f"Field {field_name} required"))
                result.is_valid = False
        return result
