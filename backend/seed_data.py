from db import db

def run_seed():
    print("[Leroy AI Seed] Seeding database records & vector embeddings...")
    db.seed_initial_data()
    print("[Leroy AI Seed] Seeding completed successfully.")

if __name__ == "__main__":
    run_seed()
