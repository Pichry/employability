"""
Pseudonymization: convert raw student identifiers to salted hashes.
Every record is immediately hashed at Layer 2 before analytics processing.
"""

import hashlib
import os
from typing import Optional


class Pseudonymizer:
    """One-way hash of student identifiers using a per-institution salt."""

    def __init__(self, salt: Optional[str] = None):
        if salt is None:
            salt = os.environ.get("PSEUDONYMIZATION_SALT")
            if not salt:
                raise ValueError("PSEUDONYMIZATION_SALT environment variable not set")
        self.salt = salt.encode() if isinstance(salt, str) else salt

    def hash_student_id(self, raw_id: str) -> str:
        """Hash a student ID to a 64-character hexadecimal string."""
        message = f"{raw_id.strip()}".encode()
        digest = hashlib.sha256(self.salt + message).hexdigest()
        return digest

    @staticmethod
    def validate_hash(hash_str: str) -> bool:
        """Check if a string is a valid SHA-256 hash."""
        if not isinstance(hash_str, str) or len(hash_str) != 64:
            return False
        try:
            int(hash_str, 16)
            return True
        except ValueError:
            return False


_pseudonymizer: Optional[Pseudonymizer] = None


def get_pseudonymizer() -> Pseudonymizer:
    """Get or create the application's pseudonymizer instance."""
    global _pseudonymizer
    if _pseudonymizer is None:
        _pseudonymizer = Pseudonymizer()
    return _pseudonymizer
