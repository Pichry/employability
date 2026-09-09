-- Graduate Employability Prediction System - Initial Schema (Phase 2)
-- PostgreSQL 15+ required
-- See CLAUDE.md §08 for zone definitions

-- ZONE E: IDENTITY, GOVERNANCE & OPERATIONS
CREATE SCHEMA IF NOT EXISTS operational;

CREATE TABLE operational.app_user (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mfa_secret VARCHAR(32),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operational.role (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

INSERT INTO operational.role (code, name) VALUES
    ('advisor', 'Career Advisor'),
    ('head', 'Academic Head'),
    ('placement', 'Placement Officer'),
    ('analyst', 'Data Analyst'),
    ('qa_ethics', 'QA / Ethics Officer'),
    ('admin', 'System Administrator')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE operational.user_scope (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES operational.app_user(id) ON DELETE CASCADE,
    scope_type VARCHAR(50) NOT NULL,
    scope_id VARCHAR(100) NOT NULL
);

CREATE TABLE operational.audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES operational.app_user(id),
    action VARCHAR(100) NOT NULL,
    student_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operational.data_source (
    id BIGSERIAL PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operational.ingestion_run (
    id BIGSERIAL PRIMARY KEY,
    source_id BIGINT NOT NULL REFERENCES operational.data_source(id),
    rows_attempted INT DEFAULT 0,
    rows_succeeded INT DEFAULT 0,
    rows_failed INT DEFAULT 0,
    status VARCHAR(20),
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE TABLE operational.ingestion_quarantine (
    id BIGSERIAL PRIMARY KEY,
    ingestion_run_id BIGINT NOT NULL REFERENCES operational.ingestion_run(id),
    row_data JSONB,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operational.student_identity (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) UNIQUE NOT NULL,
    real_name VARCHAR(255),
    student_number VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ZONE A: ACADEMIC RECORD (pseudonymous)
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE analytics.student (
    student_hash VARCHAR(64) PRIMARY KEY,
    program_id VARCHAR(100),
    cohort_year INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics.student_demog (
    student_hash VARCHAR(64) PRIMARY KEY REFERENCES analytics.student(student_hash),
    gender VARCHAR(20),
    district VARCHAR(255)
);

CREATE TABLE analytics.program (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE analytics.term (
    id VARCHAR(50) PRIMARY KEY,
    year INT,
    name VARCHAR(50)
);

CREATE TABLE analytics.course (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    name VARCHAR(255),
    is_core BOOLEAN DEFAULT FALSE
);

CREATE TABLE analytics.grade_record (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) NOT NULL REFERENCES analytics.student(student_hash),
    course_id VARCHAR(100) REFERENCES analytics.course(id),
    term_id VARCHAR(50) REFERENCES analytics.term(id),
    grade NUMERIC(3,2),
    attempt_number INT DEFAULT 1
);

CREATE TABLE analytics.internship (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) NOT NULL REFERENCES analytics.student(student_hash),
    weeks_completed INT,
    sector VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ZONE B: OUTCOMES
CREATE TABLE analytics.graduate_outcome (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) NOT NULL REFERENCES analytics.student(student_hash),
    employed_6m BOOLEAN,
    employed_12m BOOLEAN,
    UNIQUE (student_hash)
);

CREATE TABLE analytics.tracer_survey_response (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) NOT NULL REFERENCES analytics.student(student_hash),
    wave INT,
    responded_at TIMESTAMPTZ
);

-- ZONE C: MACHINE LEARNING
CREATE TABLE analytics.feature_snapshot (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) NOT NULL REFERENCES analytics.student(student_hash),
    as_of_date DATE NOT NULL,
    features JSONB,
    label BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_hash, as_of_date)
);

CREATE TABLE analytics.model_version (
    id VARCHAR(50) PRIMARY KEY,
    algorithm VARCHAR(100),
    trained_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'candidate',
    approved_by BIGINT REFERENCES operational.app_user(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics.prediction (
    id BIGSERIAL PRIMARY KEY,
    snapshot_id BIGINT NOT NULL REFERENCES analytics.feature_snapshot(id),
    model_version_id VARCHAR(50) NOT NULL REFERENCES analytics.model_version(id),
    probability NUMERIC(4,3),
    risk_segment VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics.fairness_audit (
    id BIGSERIAL PRIMARY KEY,
    model_version_id VARCHAR(50) NOT NULL REFERENCES analytics.model_version(id),
    attribute VARCHAR(100),
    tpr NUMERIC(5,4),
    parity_gap NUMERIC(5,4),
    passed BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ZONE D: INTERVENTION
CREATE TABLE analytics.intervention_type (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE analytics.intervention_case (
    id BIGSERIAL PRIMARY KEY,
    student_hash VARCHAR(64) NOT NULL REFERENCES analytics.student(student_hash),
    prediction_id BIGINT REFERENCES analytics.prediction(id),
    status VARCHAR(50) DEFAULT 'new',
    assigned_to BIGINT REFERENCES operational.app_user(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_student_program ON analytics.student(program_id);
CREATE INDEX idx_grade_student ON analytics.grade_record(student_hash);
CREATE INDEX idx_prediction_created ON analytics.prediction(created_at);
CREATE INDEX idx_audit_log_student ON operational.audit_log(student_hash);
CREATE INDEX idx_case_status ON analytics.intervention_case(status);

COMMIT;
