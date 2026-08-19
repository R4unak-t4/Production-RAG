import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ENV_FILE_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_FILE_PATH, override=True)

class Settings(BaseSettings):
    GROQ_API_KEY: str = "gsk_placeholder"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    SUPABASE_URL: str = "https://placeholder.supabase.co"
    SUPABASE_KEY: str = "placeholder_key"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE_PATH),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def is_groq_configured(self) -> bool:
        val = self.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        return bool(val and not val.startswith("gsk_placeholder") and len(val) > 10)

    @property
    def is_supabase_configured(self) -> bool:
        url = self.SUPABASE_URL or os.getenv("SUPABASE_URL", "")
        key = self.SUPABASE_KEY or os.getenv("SUPABASE_KEY", "")
        return bool(url and "placeholder" not in url and key and "placeholder" not in key)

settings = Settings()
