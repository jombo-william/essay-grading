from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import hashlib
import secrets
from passlib.context import CryptContext

load_dotenv()

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'essaygrade')

DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========== PASSWORD HASHING FUNCTIONS ==========
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

# ========== USER VERIFICATION FUNCTIONS ==========
def verify_student(db, full_name: str, email: str, registration_number: str):
    """Verify student identity for password reset"""
    try:
        query = text("""
            SELECT id, full_name, email, registration_number 
            FROM students 
            WHERE full_name = :full_name 
              AND email = :email 
              AND registration_number = :registration_number
        """)
        result = db.execute(query, {
            "full_name": full_name,
            "email": email,
            "registration_number": registration_number
        })
        return result.fetchone()
    except Exception as e:
        print(f"Error verifying student: {e}")
        return None

def verify_teacher(db, full_name: str, email: str, employee_number: str):
    """Verify teacher identity for password reset"""
    try:
        query = text("""
            SELECT id, full_name, email, employee_number 
            FROM teachers 
            WHERE full_name = :full_name 
              AND email = :email 
              AND employee_number = :employee_number
        """)
        result = db.execute(query, {
            "full_name": full_name,
            "email": email,
            "employee_number": employee_number
        })
        return result.fetchone()
    except Exception as e:
        print(f"Error verifying teacher: {e}")
        return None

# ========== PASSWORD RESET FUNCTIONS ==========
def reset_student_password(db, email: str, new_password: str):
    """Reset student password"""
    try:
        hashed_password = hash_password(new_password)
        query = text("""
            UPDATE students 
            SET password_hash = :password_hash 
            WHERE email = :email
        """)
        result = db.execute(query, {
            "password_hash": hashed_password,
            "email": email
        })
        db.commit()
        return result.rowcount > 0
    except Exception as e:
        print(f"Error resetting student password: {e}")
        db.rollback()
        return False

def reset_teacher_password(db, email: str, new_password: str):
    """Reset teacher password"""
    try:
        hashed_password = hash_password(new_password)
        query = text("""
            UPDATE teachers 
            SET password_hash = :password_hash 
            WHERE email = :email
        """)
        result = db.execute(query, {
            "password_hash": hashed_password,
            "email": email
        })
        db.commit()
        return result.rowcount > 0
    except Exception as e:
        print(f"Error resetting teacher password: {e}")
        db.rollback()
        return False

# ========== AUTHENTICATION FUNCTIONS ==========
def authenticate_student(db, email: str, password: str):
    """Authenticate a student"""
    try:
        query = text("""
            SELECT id, full_name, email, registration_number, password_hash, role
            FROM students 
            WHERE email = :email
        """)
        result = db.execute(query, {"email": email})
        student = result.fetchone()
        
        if student and verify_password(password, student[4]):
            return {
                "id": student[0],
                "full_name": student[1],
                "email": student[2],
                "registration_number": student[3],
                "role": student[5]
            }
        return None
    except Exception as e:
        print(f"Error authenticating student: {e}")
        return None

def authenticate_teacher(db, email: str, password: str):
    """Authenticate a teacher"""
    try:
        query = text("""
            SELECT id, full_name, email, employee_number, password_hash, role
            FROM teachers 
            WHERE email = :email
        """)
        result = db.execute(query, {"email": email})
        teacher = result.fetchone()
        
        if teacher and verify_password(password, teacher[4]):
            return {
                "id": teacher[0],
                "full_name": teacher[1],
                "email": teacher[2],
                "employee_number": teacher[3],
                "role": teacher[5]
            }
        return None
    except Exception as e:
        print(f"Error authenticating teacher: {e}")
        return None

def get_user_by_email(db, email: str):
    """Get user by email (checks both students and teachers)"""
    try:
        # Check students table
        query = text("""
            SELECT id, full_name, email, 'student' as role, registration_number as identifier
            FROM students 
            WHERE email = :email
        """)
        result = db.execute(query, {"email": email})
        student = result.fetchone()
        
        if student:
            return {
                "id": student[0],
                "full_name": student[1],
                "email": student[2],
                "role": student[3],
                "identifier": student[4]
            }
        
        # Check teachers table
        query = text("""
            SELECT id, full_name, email, 'teacher' as role, employee_number as identifier
            FROM teachers 
            WHERE email = :email
        """)
        result = db.execute(query, {"email": email})
        teacher = result.fetchone()
        
        if teacher:
            return {
                "id": teacher[0],
                "full_name": teacher[1],
                "email": teacher[2],
                "role": teacher[3],
                "identifier": teacher[4]
            }
        
        return None
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None

# ========== TOKEN MANAGEMENT FUNCTIONS ==========
def create_reset_token(db, user_id: int, role: str):
    """Create a password reset token"""
    try:
        token = secrets.token_urlsafe(32)
        query = text("""
            INSERT INTO password_reset_tokens (user_id, role, token, created_at, expires_at)
            VALUES (:user_id, :role, :token, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR))
        """)
        db.execute(query, {
            "user_id": user_id,
            "role": role,
            "token": token
        })
        db.commit()
        return token
    except Exception as e:
        print(f"Error creating reset token: {e}")
        db.rollback()
        return None

def verify_reset_token(db, token: str):
    """Verify a password reset token"""
    try:
        query = text("""
            SELECT user_id, role, created_at, expires_at
            FROM password_reset_tokens
            WHERE token = :token AND used = 0
        """)
        result = db.execute(query, {"token": token})
        token_data = result.fetchone()
        
        if token_data:
            # Check if token is expired
            query = text("SELECT NOW()")
            now = db.execute(query).fetchone()[0]
            
            if token_data[3] > now:
                return {
                    "user_id": token_data[0],
                    "role": token_data[1]
                }
        return None
    except Exception as e:
        print(f"Error verifying reset token: {e}")
        return None

def mark_token_as_used(db, token: str):
    """Mark a reset token as used"""
    try:
        query = text("""
            UPDATE password_reset_tokens
            SET used = 1
            WHERE token = :token
        """)
        db.execute(query, {"token": token})
        db.commit()
        return True
    except Exception as e:
        print(f"Error marking token as used: {e}")
        db.rollback()
        return False

# ========== DATABASE INITIALIZATION ==========
def init_db():
    """Initialize database tables"""
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Create password_reset_tokens table if it doesn't exist
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS password_reset_tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    role VARCHAR(20) NOT NULL,
                    token VARCHAR(255) NOT NULL UNIQUE,
                    created_at DATETIME NOT NULL,
                    expires_at DATETIME NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    INDEX idx_token (token),
                    INDEX idx_user (user_id, role)
                )
            """))
            conn.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")

