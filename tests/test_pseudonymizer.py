"""Tests for pseudonymization module."""
import pytest
from data.ingest.pseudonymizer import Pseudonymizer


class TestPseudonymizer:
    def test_deterministic_hashing(self):
        p = Pseudonymizer(salt="test_salt")
        hash1 = p.hash_student_id("STU001")
        hash2 = p.hash_student_id("STU001")
        assert hash1 == hash2

    def test_hash_format(self):
        p = Pseudonymizer(salt="test_salt")
        hash_str = p.hash_student_id("STU001")
        assert len(hash_str) == 64
        assert all(c in "0123456789abcdef" for c in hash_str)

    def test_different_ids_different_hashes(self):
        p = Pseudonymizer(salt="test_salt")
        hash1 = p.hash_student_id("STU001")
        hash2 = p.hash_student_id("STU002")
        assert hash1 != hash2

    def test_validate_hash(self):
        valid_hash = "a" * 64
        assert Pseudonymizer.validate_hash(valid_hash) is True
        assert Pseudonymizer.validate_hash("too_short") is False
