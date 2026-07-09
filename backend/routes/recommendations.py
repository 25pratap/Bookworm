from fastapi import APIRouter, HTTPException
from database.supabase_client import supabase
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

@router.get("/recommend/{email}")
def initial_recommendations(email: str):

    # Get user's favorite genres
    profile = (
        supabase.table("profiles")
        .select("favorite_genres")
        .eq("email", email)
        .single()
        .execute()
    )

    if not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    favorite_genres = profile.data.get("favorite_genres", [])

    if len(favorite_genres) == 0:
        raise HTTPException(status_code=404, detail="No favorite genres selected")

    # Get books
    books = (
        supabase.table("books")
        .select("*")
        .execute()
    )

    recommendations = []

    for book in books.data:
        if book["genre"] in favorite_genres:
            recommendations.append({
                "id": book["id"],
                "title": book["title"],
                "author": book["author"],
                "genre": book["genre"],
                "similarity": 1.0
            })

    return {
        "recommendations": recommendations[:10]
    }

@router.get("/recommend/{email}/{title}")
def recommend_books(email: str, title: str):

    # Fetch all books
    result = supabase.table("books").select("*").execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No books found")

    df = pd.DataFrame(result.data)

    # Fetch all reviews
    reviews_result = supabase.table("reviews").select("*").execute()

    reviews_df = pd.DataFrame(reviews_result.data)

    if reviews_df.empty:
        reviews_df = pd.DataFrame(
            columns=["user_email", "book_id", "rating"]
        )

    # Make sure these columns exist
    required_columns = ["title", "author", "genre", "description"]

    for col in required_columns:
        if col not in df.columns:
            df[col] = ""

    # Combine text
    df["content"] = (
        df["title"].fillna("") + " " +
        df["author"].fillna("") + " " +
        df["genre"].fillna("") + " " +
        df["description"].fillna("")
    )

    # TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english")

    tfidf_matrix = vectorizer.fit_transform(df["content"])

    # Cosine Similarity
    similarity = cosine_similarity(tfidf_matrix)
    profile = (
        supabase.table("profiles")
        .select("favorite_genres")
        .eq("email", email)
        .single()
        .execute()
    )

    favorite_genres = []

    if profile.data:
        favorite_genres = profile.data["favorite_genres"] or []
    
            # -----------------------------
        # Collaborative Filtering
        # -----------------------------

        if not reviews_df.empty:

            rating_matrix = reviews_df.pivot_table(
                index="user_email",
                columns="book_id",
                values="rating"
            )

            user_similarity = cosine_similarity(
                rating_matrix.fillna(0)
            )

            similarity_df = pd.DataFrame(
                user_similarity,
                index=rating_matrix.index,
                columns=rating_matrix.index
            )

            if email in similarity_df.index:

                similar_users = (
                    similarity_df[email]
                    .sort_values(ascending=False)
                    .drop(email)
                )

            else:
                similar_users = pd.Series(dtype=float)

        else:

            similar_users = pd.Series(dtype=float)

    # Find selected book
    selected = df[
        df["title"].str.strip().str.lower() ==
        title.strip().lower()
]
    if selected.empty:
        raise HTTPException(status_code=404, detail="Book not found")

    index = selected.index[0]

    scores = list(enumerate(similarity[index]))

    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    scores = scores[1:min(6, len(scores))]

    recommendations = []
    for i, score in scores:
        book=df.iloc[i]

        content_score = float(score)

        genre_score = 0

        if book["genre"] in favorite_genres:
            genre_score = 0.30

        collaborative_score = 0

        if not similar_users.empty:

            for other_user, sim in similar_users.items():

                rating = reviews_df[
                    (reviews_df["user_email"] == other_user) &
                    (reviews_df["book_id"] == book["id"])
                ]

                if not rating.empty:

                    collaborative_score += (
                        sim * rating.iloc[0]["rating"]
                    )

            collaborative_score /= 5

        final_score = (
            content_score +
            genre_score +
            collaborative_score
        )

        recommendations.append({
            "id": int(df.iloc[i]["id"]),
            "title": df.iloc[i]["title"],
            "author": df.iloc[i]["author"],
            "genre": df.iloc[i]["genre"],
            "similarity": round(final_score, 2)
        })
    recommendations.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return {
        "recommendations": recommendations
    }